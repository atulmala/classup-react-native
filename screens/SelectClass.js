import React, { Suspense } from 'react';
import { useState } from 'react';
import {
  StyleSheet, Platform, ScrollView, Modal, Button, Text,
  View, TextInput, TouchableOpacity, Alert
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

import { Chevron } from 'react-native-shapes';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Constants/colors';

const SelectClass = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;

  var classList = [];
  var sectionList = [];
  var subjectList = [];

  var selectedClass;
  var selectedSection;
  var selectedSubject;

  // retrieve the list of classes, sections, and subjects for this school
  const getClassList = () => {
    return axios.get(serverIP.concat("/academics/class_list/", schoolId, "/"));
  };

  const getSectionList = () => {
    return axios.get(serverIP.concat("/academics/section_list/", schoolId, "/"));
  };

  const getSubjectList = () => {
    return axios.get(serverIP.concat("/academics/subject_list/", schoolId, "/"));
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
        aSubject.label = subjects.data[i].subject_name;
        aSubject.value = subjects.data[i].subject_name;
        subjectList.push(aSubject);
      }
      console.log("subjectList = ", subjectList);
    })
  );

  let today = new Date();
  const [date, setDate] = useState(today);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
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

  var selectedDate = "";
  var selectedClass = "";
  var selectedSection = "";
  var selectedSubject = "";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.parallel}>
          <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
            <Text style={styles.font}>Select Date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateButton}>
            <Text style={styles.font}>{ddmmyy(date)}</Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === 'ios' && show && (
          <DateTimePicker
            style={{ width: '100%' }}
            value={date}
            mode={mode}
            maximumDate={new Date()}
            onChange={onChange}
          />
        )}
        {Platform.OS === 'android' && show && (
          <DateTimePicker
            value={date}
            mode={mode}
            display="spinner"
            maximumDate={new Date()}
            onChange={onChange}
          />
        )}

        <View paddingVertical={5} />

        <Text style={styles.heading}>Select Class</Text>
        <DropDownPicker
          items={[
            { label: 'Item 1', value: 'item1' },
            { label: 'Item 2', value: 'item2' },
          ]}
          defaultIndex={0}
          containerStyle={{ height: 40 }}
          onChangeItem={item => console.log(item.label, item.value)}
        />

        {/* and iOS onUpArrow/onDownArrow toggle example */}

      </ScrollView>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"

  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
    width: "100%"
  },
  scrollContentContainer: {
    paddingTop: 40,
    paddingBottom: 10,
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
