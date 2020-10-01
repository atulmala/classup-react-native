import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { IndexPath, Datepicker, Layout, Text, Select, Button, SelectItem, Icon } from '@ui-kitten/components';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const calendarIcon = (props) => (
  <Icon {...props} name='calendar'/>
);

const useDatepickerState = (initialDate = null) => {
  const [date, setDate] = React.useState(initialDate);
  return { date, onSelect: setDate };
};

const ScheduleTest = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { exam } = route.params;

  const startDate = exam.startDate.split("-");
  const endDate = exam.endDate.split("-");
  const min = new Date(startDate[0], startDate[1] - 1, startDate[2]);
  console.log("min = ", min);
  
  const max = new Date(endDate[0], endDate[1] - 1, endDate[2]);
  console.log("max = ", max);
  const minMaxPickerState = useDatepickerState(min);
  const [date, setDate] = React.useState(new Date());

  const [classList] = useState([]);
  var selectedClass;
  const [selectedClassIndex, setSelectedClassIndex] = useState(new IndexPath(0));
  const displayClassValue = classList[selectedClassIndex.row];

  const [sectionList] = useState([]);
  var selectedSection;
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(new IndexPath(0));
  const displaySectionValue = sectionList[selectedSectionIndex.row];

  const [subjectList] = useState([]);
  var selectedSubject;
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(new IndexPath(0));
  const displaySubjectValue = subjectList[selectedSubjectIndex.row];

  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  const [isLoading, setLoading] = useState(true);

  // retrieve the list of classes, sections, and subjects for this school
  const getClassList = () => {
    return axios.get(serverIP.concat("/academics/class_list/", schoolID, "/"));
  };

  const getSectionList = () => {
    return axios.get(serverIP.concat("/academics/section_list/", schoolID, "/"));
  };

  const getSubjectList = () => {
    return axios.get(serverIP.concat("/teachers/teacher_subject_list/", userID, "/"));
  };

  useEffect(() => {
    axios.all([getClassList(), getSectionList(), getSubjectList()]).then(
      axios.spread(function (classes, sections, subjects) {
        classList.push("Select");
        for (var i = 0; i < classes.data.length; i++) {
          classList.push(classes.data[i].standard);
        }

        sectionList.push("Select");
        for (i = 0; i < sections.data.length; i++) {
          sectionList.push(sections.data[i].section);
        }

        subjectList.push("Select");
        for (i = 0; i < subjects.data.length; i++) {
          subjectList.push(subjects.data[i].subject);
        }
        setLoading(false);
      })
    );
  }, []);

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.text} status='warning' category='h6'>Schedule Test for {exam.title}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'rebeccapurple',
      },
    });
  });

  const scheduleTest = () => {
    if (selectedClassIndex.row === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Class Not Selected',
        text2: "Please Select a Class",
      });
      return;
    }
    else  {
      selectedClass = classList[selectedClassIndex.row];
    }

    if (selectedSectionIndex.row === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Section Not Selected',
        text2: "Please Select a Section",
      });
      return;
    }
    else  {
      selectedSection = sectionList[selectedSectionIndex.row];
    }

    if (selectedSubjectIndex.row === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Subject Not Selected',
        text2: "Please Select a Subject",
      });
      return;
    }
    else  {
      selectedSubject = subjectList[selectedSubjectIndex.row];
    }
    
    const splitDate = date.toLocaleDateString().split("/");
    const selectedDay = splitDate[1];
    const selectedMonth = splitDate[0];
    const selectedYear = splitDate[2];

    navigation.navigate('TakeAttendance', {
      serverIP: serverIP,
      schoolId: schoolId,
      userID: userID,
      userName: userName,
      selectedDay: selectedDay,
      selectedMonth: selectedMonth,
      selectedYear: selectedYear,
      selectedClass: selectedClass,
      selectedSection: selectedSection,
      selectedSubject: selectedSubject,
      comingFrom: "SelectClass"
    });
  };

  return (
    <Layout style={styles.container} level='1'>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <Layout style={styles.loading}>
        <ActivityIndicator size='large' />
      </Layout> : (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}>
            <Layout
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContentContainer}>
              <Text style={styles.text} category='s1' status='info'>
                Select date:
              </Text>
              <Datepicker
                style={styles.select}
                accessoryRight={calendarIcon}
                date={min}
                min={min}
                max={max}
                {...minMaxPickerState}
                
              />
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.parallel}>
                <Layout style={styles.container}>
                  <Text style={styles.text} category='s1' status='info'>
                    Select Class:
                  </Text>
                  <Select
                    style={styles.select}
                    value={displayClassValue}
                    selectedIndex={selectedClassIndex}
                    onSelect={index => setSelectedClassIndex(index)}>
                    {classList.map(renderOption)}
                  </Select>
                </Layout>
                <Layout style={styles.container}>
                  <Text style={styles.text} category='s1' status='info'>
                    Select Section:
                  </Text>
                  <Select
                    style={styles.select}
                    value={displaySectionValue}
                    selectedIndex={selectedSectionIndex}
                    onSelect={index => setSelectedSectionIndex(index)}>
                    {sectionList.map(renderOption)}
                  </Select>
                </Layout>
              </Layout>
              <Layout style={styles.verticalSpace} />
              <Text style={styles.text} category='s1' status='info'>
                Select Subject:
              </Text>
              <Select
                style={styles.select}
                value={displaySubjectValue}
                selectedIndex={selectedSubjectIndex}
                onSelect={index => setSelectedSubjectIndex(index)}>
                {subjectList.map(renderOption)}
              </Select>
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.buttonContainer}>
                <Button style={styles.button} appearance='outline' status='info' onPress={scheduleTest}>
                  {"Take Attendance"}
                </Button>
              </Layout>
            </Layout>
          </ScrollView >
        )}
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  select: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  buttonContainer:  {
    flex: 1,
    alignItems: "center"
  },
  button: {
    margin: 2,
    width: "60%"
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100
  },
  verticalSpace: {
    marginTop: 15
  },
  scrollContentContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },
  parallel: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: "100%"
  },
  text: {
    margin: 2,
    fontSize: 14,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88'
  }
});

export default ScheduleTest;
