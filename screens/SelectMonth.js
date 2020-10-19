import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { IndexPath, Layout, Text, Select, Button, SelectItem, CheckBox, RadioGroup, Radio } from '@ui-kitten/components';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const SelectMonth = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

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

  const [selectedYearIndex, setSelectedYearIndex] = React.useState(-1);
  let year = "till_date";

  const [monthList] = useState(['Select', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  var selectedMonth;
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new IndexPath(0));
  const displayMonthValue = monthList[selectedMonthIndex.row];

  const useCheckboxState = (initialCheck = false) => {
    const [checked, setChecked] = React.useState(initialCheck);
    return { checked, onChange: setChecked };
  };

  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  const [isLoading, setLoading] = useState(true);
  const primaryCheckboxState = useCheckboxState();

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

  const takeAttendance = () => {
    if (selectedClassIndex.row === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Class Not Selected',
        text2: "Please Select a Class",
      });
      return;
    }
    else {
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
    else {
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
    else {
      selectedSubject = subjectList[selectedSubjectIndex.row];
    }

    if (!primaryCheckboxState.checked) {
      if (selectedMonthIndex.row === 0) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Duration not Selected',
          text2: "Please select a month or check the Till Date checkbox",
        });
        return;
      }
      else {
        selectedMonth = monthList[selectedMonthIndex.row];
      }

      switch (selectedYearIndex) {
        case -1:
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error: Year Not Selected',
            text2: "Please Select a Year",
          });
          return;
        case 0:
          year = new Date().getFullYear();
          break;
        case 1:
          year = new Date().getFullYear() - 1;
          break;
      }
    }
    else {
      selectedMonth = "Jan";
    }

    console.log("selectedClass = ", selectedClass);
    console.log("selectedSubject = ", selectedSubject);
    console.log("selectedSection = ", selectedSection);
    console.log("selectedMonth = ", selectedMonth);
    console.log ("year = ", year);

    navigation.navigate('AttendanceSummaryClass', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      theClass: selectedClass,
      section: selectedSection,
      subject: selectedSubject,
      month: selectedMonth,
      year: year
    });
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText} status='warning' >Select Class, Section & Month</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'darkviolet',
      },
    });
  });

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
              <Layout style={styles.container}>
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
              </Layout>
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.parallel}>
                <Layout style={styles.container}>
                  <CheckBox
                    style={styles.checkbox}
                    status='primary'
                    {...primaryCheckboxState}>
                    Till Date
                  </CheckBox>
                </Layout>
              </Layout>
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.container}>
                <Text style={styles.text} category='s1' status='info'>
                  Select Month:
                  </Text>
                <Select
                  style={styles.select}
                  disabled={primaryCheckboxState.checked ? true : false}
                  value={displayMonthValue}
                  selectedIndex={selectedMonthIndex}
                  onSelect={index => setSelectedMonthIndex(index)}>
                  {monthList.map(renderOption)}
                </Select>
              </Layout>
              <Layout style={styles.container}>
                <Text style={styles.text} category='s1' status='info'>
                  Select Year:
                  </Text>
                <RadioGroup
                  selectedIndex={selectedYearIndex}
                  onChange={index => setSelectedYearIndex(index)}>
                  <Radio disabled={primaryCheckboxState.checked ? true : false}>Current Year</Radio>
                  <Radio disabled={primaryCheckboxState.checked ? true : false}>Last Year</Radio>
                </RadioGroup>
              </Layout>
              

              <Layout style={styles.verticalSpace} />
              <Layout style={styles.buttonContainer}>
                <Button
                  style={styles.button}
                  size='small'
                  appearance='outline'
                  status='info'
                  onPress={takeAttendance}>
                  {"Show Attendance Summary"}
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
  checkbox: {
    flex: 1,
    margin: 4,
  },
  buttonContainer: {
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
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 16,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
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

export default SelectMonth;
