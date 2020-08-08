import React from 'react';
import { useState } from 'react';
import { StyleSheet, Platform, ScrollView, Button, Text, View } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const SelectClass = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  var classList = [];
  var sectionList = [];
  var subjectList = [];

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

  const [spinner, setShowSpinner] = useState(false);

  axios.all([getClassList(), getSectionList(), getSubjectList()]).then(
    axios.spread(function (classes, sections, subjects) {
      self.class_list = classes.data;
      self.section_list = sections.data;
      self.subject_list = subjects.data;

      for (var i = 0; i < classes.data.length; i++) {
        let aClass = {};
        aClass.label = classes.data[i].standard;
        aClass.value = classes.data[i].standard;
        classList.push(aClass);
      }
      console.log("classList = ", classList);
      for (i = 0; i < sections.data.length; i++) {
        let aSection = {};
        aSection.label = sections.data[i].section;
        aSection.value = sections.data[i].section;
        sectionList.push(aSection);
      }
      console.log("sectionList = ", sectionList);
      for (i = 0; i < subjects.data.length; i++) {
        let aSubject = {};
        aSubject.label = subjects.data[i].subject;
        aSubject.value = subjects.data[i].subject;
        if (subjects.data[i].subject === "Main") {
          console.log("subject", subjects.data[i].subject);
          aSubject.selected = true;
        }
        subjectList.push(aSubject);
      }
      console.log("subjectList = ", subjectList);
    })
  );

  defaultSubject = {
    defaultSubject: ['Main']
  };

  let today = new Date();
  var selectedDay = today.getDate();
  var selectedMonth = today.getMonth() + 1;
  var selectedYear = today.getFullYear();
  const [date, setDate] = useState(today);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    selectedMonth = selectedDate.getMonth() + 1;
    console.log("selectedMonth = ", selectedMonth);
    selectedDay = selectedDate.getDate();
    console.log("SelectedDay = ", selectedDay);
    selectedYear = selectedDate.getFullYear();
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
  var selectedClass = "";
  var selectedSection = "";
  var selectedSubject = "";

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
      comingFrom: "takeAttendance"

    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <Button
          onPress={() => showTakeAttendance()}
          title="Next"
        />
    });
  });

  return (
    <View style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}>

        {Platform.OS === 'ios' && (
          <View>
            <View style={styles.scrollContainer}>
              <Text style={styles.heading}>Select Date</Text>
            </View>
            <DateTimePicker
              style={{ width: '100%' }}
              value={date}
              mode={mode}
              maximumDate={new Date()}
              onChange={onChange}
            />
          </View>
        )}
        {Platform.OS === 'android' && show && (
          <View>
            <View style={styles.parallel}>
              <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
                <Text style={styles.font}>Select Date</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.font}>{ddmmyy(date)}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <DateTimePicker
                value={date}
                mode={mode}
                display="spinner"
                maximumDate={new Date()}
                onChange={onChange}
              />
            </View>
          </View>
        )}

        <View style={styles.parallel}>
          <View style={styles.scrollContainer1}>
            <Text style={styles.heading}>Class</Text>
            <DropDownPicker
              items={classList}
              placeholder="Select a Class"
              defaultIndex={0}
              containerStyle={{ height: 40, width: "100%" }}
              style={{ backgroundColor: '#fafafa' }}
              itemStyle={{
                justifyContent: 'flex-start'
              }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={item => selectedClass = item.value}
            />
          </View>
          <View style={styles.scrollContainer1}>
            <Text style={styles.heading}>Section</Text>
            <DropDownPicker
              items={sectionList}
              placeholder="Select a Section"
              defaultIndex={0}
              containerStyle={{ height: 40 }}
              style={{ backgroundColor: '#fafafa' }}
              itemStyle={{
                justifyContent: 'flex-start'
              }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={item => selectedSection = item.value}
            />
          </View>
          <View style={styles.scrollContainer2}>
            <Text style={styles.heading}>Subject</Text>
            <DropDownPicker
              items={subjectList}
              containerStyle={{ height: 40, width: "100%" }}
              style={{ backgroundColor: '#fafafa' }}
              itemStyle={{
                justifyContent: 'flex-start'
              }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={item => selectedSubject = item.value}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"

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
    fontStyle: "italic"
  },

  spinnerTextStyle: {
    color: '#FFF'
  },
});



export default SelectClass;
