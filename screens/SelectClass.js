import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Platform, ScrollView, Button, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  View,
  Colors,
  Dialog,
  Picker,
  DateTimePicker,
  Avatar,
  Assets,
  PanningProvider
} from 'react-native-ui-lib';
import axios from 'axios';
import Toast from 'react-native-toast-message';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import dropdown from '../assets/chevronDown.png';

const SelectClass = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [classList] = useState([]);
  const [selectedClass, setSelectedClass] = useState();
  const [sectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState();
  const [subjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState();

  const [isLoading, setLoading] = useState(true);

  // retrieve the list of classes, sections, and subjects for this school
  const getClassList = () => {
    return axios.get(serverIP.concat("/academics/class_list/", schoolId, "/"));
  };

  const getSectionList = () => {
    return axios.get(serverIP.concat("/academics/section_list/", schoolId, "/"));
  };

  const getSubjectList = () => {
    return axios.get(serverIP.concat("/teachers/teacher_subject_list/", userID, "/"));
  };

  useEffect(() => {
    axios.all([getClassList(), getSectionList(), getSubjectList()]).then(
      axios.spread(function (classes, sections, subjects) {
        for (var i = 0; i < classes.data.length; i++) {
          let aClass = {};
          aClass.key = classes.data[i].id;
          aClass.label = classes.data[i].standard;
          aClass.value = classes.data[i].standard;
          classList.push(aClass);
        }
        for (i = 0; i < sections.data.length; i++) {
          let aSection = {};
          aSection.key = sections.data[i].id;
          aSection.label = sections.data[i].section;
          aSection.value = sections.data[i].section;
          sectionList.push(aSection);
        }
        for (i = 0; i < subjects.data.length; i++) {
          let aSubject = {};
          aSubject.key = subjects.data[i].id;
          aSubject.label = subjects.data[i].subject;
          aSubject.value = subjects.data[i].subject;
          if (subjects.data[i].subject === "Main") {
            console.log("subject", subjects.data[i].subject);
            aSubject.selected = true;
          }
          subjectList.push(aSubject);
        }
        setLoading(false);
      })
    );
  }, []);

  defaultSubject = {
    defaultSubject: ['Main']
  };

  let today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [date, setDate] = useState(today);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setSelectedMonth(selectedDate.getMonth() + 1);
    console.log("selectedMonth = ", selectedMonth);
    setSelectedDay(selectedDate.getDate());
    console.log("SelectedDay = ", selectedDay);
    setSelectedYear(selectedDate.getFullYear());
    console.log("SelectedYear = ", selectedYear);
    console.log(new Date(selectedDate));
    const currentDate = selectedDate || date;
    console.log("currentDate = ", currentDate);
    setShow(false);
    setDate(currentDate);
  };

  const ddmmyy = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };


  const showTakeAttendance = () => {
    if (selectedClass == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Class Not Selected',
        text2: "Please Select a Class",
      });
      return;
    }

    if (selectedSection == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Section Not Selected',
        text2: "Please Select a Section",
      });
      return;
    }

    if (selectedSubject == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Subject Not Selected',
        text2: "Please Select a Subject",
      });
      return;
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <TouchableOpacity onPress={() => showTakeAttendance()}>
          <Icon name="arrow-circle-right" size={30} padding={10} color="black" />
        </TouchableOpacity>
    });
  });

  return (
    <View style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}>
            <View flex padding-20
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContentContainer}>
              <DateTimePicker
                containerStyle={{ marginVertical: 20 }}
                title={'Selecte Attendance Date'}
                placeholder={'Select date'}
              />
              <Picker
                placeholder="Select Class"
                value={selectedClass}
                floatingPlaceholder
                style={{ color: Colors.violet10 }}
                onChange={item => setSelectedClass(item)}
                rightIconSource={dropdown}
                renderCustomModal={renderDialog}
              >
                {_.map(classList, option => (
                  <Picker.Item key={classList.value} value={option} disabled={option.disabled} />
                ))}
              </Picker>
              <Picker
                placeholder="Select Section"
                floatingPlaceholder
                style={{ color: Colors.purple10 }}
                value={selectedSection}
                onChange={item => setSelectedSection(item)}
                rightIconSource={dropdown}
                renderCustomModal={renderDialog}
              >
                {_.map(sectionList, option => (
                  <Picker.Item key={sectionList.value} value={option} disabled={option.disabled} />
                ))}
              </Picker>
              <Picker
                placeholder="Select Subject"
                topBarProps={{ title: 'Please Select Subject' }}
                floatingPlaceholder
                style={{ color: Colors.green10 }}
                value={selectedSubject}
                onChange={item => setSelectedSubject(item)}
                rightIconSource={dropdown}
                renderCustomModal={renderDialog}
              >
                {_.map(subjectList, option => (
                  <Picker.Item key={subjectList.value} value={option} disabled={option.disabled} />
                ))}
              </Picker>
            </View>
          </ScrollView>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 100
  },
  verticalSpace: {
    paddingVertical: 100,
    marginTop: 100
  },
  scrollContainer1: {
    flex: 1,
    paddingHorizontal: 5,
    width: "100%",

  },
  scrollContainer2: {
    flex: 2,
    paddingHorizontal: 5,
    width: "100%",
  },
  scrollContentContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 40,
    paddingBottom: 10,
  },
  parallel: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: "100%"
  },
  dateButton: {
    backgroundColor: '#BBDEFB',
    width: '45%',
    margin: 5,
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextButton: {
    backgroundColor: '#BBDEFB',
    width: '100%',
    height: '60%',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  font: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    fontSize: 18,
    color: "white"
  },
  heading: {
    color: "#1a237e",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 5
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

export default SelectClass;