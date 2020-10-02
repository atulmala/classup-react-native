import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';

import {
  ScrollView, View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView,
} from 'react-native';

import { useHeaderHeight } from '@react-navigation/stack';

import {
  IndexPath, Datepicker, Layout, Text, Select, CheckBox,
  Input, Button, SelectItem, Icon
} from '@ui-kitten/components';

import axios from 'axios';
import Toast from 'react-native-toast-message';

const calendarIcon = (props) => (
  <Icon {...props} name='calendar' />
);

const useDatepickerState = (initialDate = null) => {
  const [date, setDate] = React.useState(initialDate);
  return { date, onSelect: setDate };
};

const useCheckboxState = (initialCheck = false) => {
  const [checked, setChecked] = React.useState(initialCheck);
  return { checked, onChange: setChecked };
};

const ScheduleTest = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { exam } = route.params;

  const primaryCheckboxState = useCheckboxState();

  const startDate = exam.startDate.split("-");
  const endDate = exam.endDate.split("-");
  const min = new Date(startDate[0], startDate[1] - 1, startDate[2]);

  const max = new Date(endDate[0], endDate[1] - 1, endDate[2]);
  const minMaxPickerState = useDatepickerState(min);

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

  const [maxMarks, setMaxMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");

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
  }, [schoolID]);

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
    testDate = minMaxPickerState.date.toISOString().toString().substring(0, 10).split("-");
    yy = testDate[0];
    mm = testDate[1];
    dd = testDate[2];
    
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
      console.log("Grade based = ", primaryCheckboxState.checked)
      if (maxMarks == "") {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error: Max Marks Not Entered',
          text2: "Please enter Max Marks",
        });
        return;
      }
      if (passingMarks == "") {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error: Passing Marks Not Entered',
          text2: "Please enter Passing Marks",
        });
        return;
      }

    }

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

  return (<KeyboardAvoidingView
    behavior={Platform.OS == "ios" ? "padding" : "height"} 
    keyboardVerticalOffset = {useHeaderHeight()}
    style={styles.container} >
    <Layout style={styles.container} level='1'>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <Layout style={styles.loading}>
        <ActivityIndicator size='large' />
      </Layout> : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={styles.mainContainer} >
              <Layout style={styles.parallel}>
                <Datepicker
                  style={styles.select}
                  label={evaProps => <Text {...evaProps}>Select Date:</Text>}
                  accessoryRight={calendarIcon}
                  min={min}
                  max={max}
                  onSelect={nextDate => useDatepickerState(nextDate)}
                  {...minMaxPickerState}
                />
              </Layout>
              <Layout style={styles.parallel}>
                <Select
                  style={styles.select}
                  label={evaProps => <Text {...evaProps}>Select Class:</Text>}
                  value={displayClassValue}
                  selectedIndex={selectedClassIndex}
                  onSelect={index => setSelectedClassIndex(index)}>
                  {classList.map(renderOption)}
                </Select>
                <Select
                  style={styles.select}
                  label={evaProps => <Text {...evaProps}>Select Section:</Text>}
                  value={displaySectionValue}
                  selectedIndex={selectedSectionIndex}
                  onSelect={index => setSelectedSectionIndex(index)}>
                  {sectionList.map(renderOption)}
                </Select>
              </Layout>
              <Layout style={styles.parallel}>
                <Select
                  style={styles.select}
                  label={evaProps => <Text {...evaProps}>Select Subject:</Text>}
                  value={displaySubjectValue}
                  selectedIndex={selectedSubjectIndex}
                  onSelect={index => setSelectedSubjectIndex(index)}>
                  {subjectList.map(renderOption)}
                </Select>
              </Layout>
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.parallel}>
                <CheckBox
                  style={styles.checkbox}
                  status='primary'
                  {...primaryCheckboxState}>
                    Grade Based
                </CheckBox>
                
              </Layout>
              <Layout style={styles.parallel}>
                <Input
                  style={styles.select}
                  disabled={primaryCheckboxState.checked ? true : false}
                  size='small'
                  keyboardType="number-pad"
                  label={evaProps => <Text {...evaProps}>Max Marks:</Text>}
                  onChangeText={text => setMaxMarks(text)}
                  caption={primaryCheckboxState.checked ? "" : "Mandatory"}
                />
                <Input
                  style={styles.select}
                  disabled={primaryCheckboxState.checked ? true : false}
                  size='small'
                  keyboardType="decimal-pad"
                  label={evaProps => <Text {...evaProps}>Passing Marks:</Text>}
                  onChangeText={text => setPassingMarks(text)}
                  caption={primaryCheckboxState.checked ? "" : "Mandatory"}
                />
              </Layout>
              <Layout style={styles.verticalSpace} />
              <View style={styles.parallel}>
                <Button
                  style={styles.button}
                  size='small'
                  status='info'
                  onPress={scheduleTest}>
                  Schedule Test
                </Button>
              </View>
            </ScrollView >
          </TouchableWithoutFeedback>
        )}
    </Layout>
  </KeyboardAvoidingView>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    width: "100%",

  },
  evaProps: {
    textShadowColor: "magenta"
  },
  select: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  button: {
    margin: 2,
    backgroundColor: "cornflowerblue",
    width: "80%",
    height: "60%",
  },
  checkbox: {
    flex: 1,
    margin: 4,
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  verticalSpace: {
    marginTop: 10
  },
  mainContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  hwDescription: {
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'top',
    borderColor: "cyan"
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
