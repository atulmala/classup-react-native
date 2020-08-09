import React from 'react';
import { StyleSheet, Platform, ScrollView, Button, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

const TakeAttendance = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { selectedDay } = route.params;
  const { selectedMonth } = route.params;
  const { selectedYear } = route.params;
  const { selectedClass } = route.params;
  const { selectedSection } = route.params;
  const { selectedSubject } = route.params;

  var studentList = [];
  var absenteeList = [];
  var total;
  var present;
  var absent;

  const getStudentList = () => {
    return axios.get(serverIP.concat("/student/list/", schoolId, "/", selectedClass, "/", selectedSection, "/"));
  };

  const getData = () => {
    return studentList;
  };

  const getAbsenteeList = () => {
    return axios.get(serverIP.concat("/attendance/retrieve/", schoolId, "/", selectedClass, "/", selectedSection,
      "/", selectedSubject, "/", selectedDay, "/", selectedMonth, "/", selectedYear, "/"));
  };

  axios.all([getStudentList(), getAbsenteeList()]).then(
    axios.spread(function (students, absentees) {
      absent = absentees.data.length;
      for (var i = 0; i < absentees.data.length; i++) {
        absenteeList.push(absentees.data[i].student);
      }
      total = students.data.length;
      present = total - absent;
      for (i = 0; i < students.data.length; i++) {
        let student = {};
        let s_no = i + 1;
        student.id = students.data[i].id;
        if (absenteeList.indexOf(student.id) > -1) {
          student.presence = "absent";
          student.toggle = "toggle_off";
          student.presence_color = "#EF5350";
        } else {
          student.presence = "present";
          student.toggle = "toggle_on";
          student.presence_color = "green darken-2";
        }
        student.title = s_no + ".  " + 
          students.data[i].fist_name +
          " " +
          students.data[i].last_name;
        student.name =
          students.data[i].fist_name +
          " " +
          students.data[i].last_name;
        studentList.push(student);
      }
      console.log("studentList = ", studentList);
    })
  );

  const CustomRow = ({ title }) => (
    <View style={styles.containerRow}>
      <View style={styles.container_text}>
        <Text style={styles.title}>
          {title}
        </Text>
      </View>
    </View>
  );

  const CustomListview = ({ itemList }) => (
    <View style={styles.container}>
      <FlatList
        data={itemList}
        renderItem={({ item }) => <CustomRow
          title={item.title}
        />}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomListview
        itemList={studentList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 0,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 6,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  description: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  photo: {
    height: 50,
    width: 50,
  },
});

export default TakeAttendance;