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
          student.id = students.data[i].id.toString();
          student.key = students.data[i].id.toString();
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
        student.id = students.data[i].id.toString();
        student.key = students.data[i].id.toString();
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

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const DATA = [{"id": "42", "key": "42", "name": "Aliya Sharma", "presence": "present", "presence_color": "green darken-2", "title": "1.  Aliya Sharma", "toggle": "toggle_on"}, {"id": "43", "key": "43", "name": "Aryan Pandit", "presence": "present", "presence_color": "green darken-2", "title": "2.  Aryan Pandit", "toggle": "toggle_on"}, {"id": "44", "key": "44", "name": "Babita Raghunvanshi", "presence": "present", "presence_color": "green darken-2", "title": "3.  Babita Raghunvanshi", "toggle": "toggle_on"}, {"id": "45", "key": "45", "name": "Boski Gulzar", "presence": "present", "presence_color": "green darken-2", "title": "4.  Boski Gulzar", "toggle": "toggle_on"}, {"id": "46", "key": "46", "name": "Chandra Sharan", "presence": "present", "presence_color": "green darken-2", "title": "5.  Chandra Sharan", "toggle": "toggle_on"}, {"id": "47", "key": "47", "name": "Devesh Jain", "presence": "present", "presence_color": "green darken-2", "title": "6.  Devesh Jain", "toggle": "toggle_on"}, {"id": "48", "key": "48", "name": "Dinki Mahajan", "presence": "present", "presence_color": "green darken-2", "title": "7.  Dinki Mahajan", "toggle": "toggle_on"}, {"id": "49", "key": "49", "name": "Eashwar Kalani", "presence": "present", "presence_color": "green darken-2", "title": "8.  Eashwar Kalani", "toggle": "toggle_on"}, {"id": "50", "key": "50", "name": "Farid Zakaria", "presence": "present", "presence_color": "green darken-2", "title": "9.  Farid Zakaria", "toggle": "toggle_on"}, {"id": "51", "key": "51", "name": "Gun Malhotra", "presence": "present", "presence_color": "green darken-2", "title": "10.  Gun Malhotra", "toggle": "toggle_on"}, {"id": "52", "key": "52", "name": "Harmesh  Malhotra", "presence": "present", "presence_color": "green darken-2", "title": "11.  Harmesh  Malhotra", "toggle": "toggle_on"}, {"id": "53", "key": "53", "name": "Ivan Zokowich", "presence": "present", "presence_color": "green darken-2", "title": "12.  Ivan Zokowich", "toggle": "toggle_on"}, {"id": "54", "key": "54", "name": "Jack Bawar", "presence": "present", "presence_color": "green darken-2", "title": "13.  Jack Bawar", "toggle": "toggle_on"}, {"id": "17603", "key": "17603", "name": "Jagan Reddy", "presence": "present", "presence_color": "green darken-2", "title": "14.  Jagan Reddy", "toggle": "toggle_on"}, {"id": "55", "key": "55", "name": "Karl Marx", "presence": "present", "presence_color": "green darken-2", "title": "15.  Karl Marx", "toggle": "toggle_on"}, {"id": "56", "key": "56", "name": "Lalu Yadav", "presence": "present", "presence_color": "green darken-2", "title": "16.  Lalu Yadav", "toggle": "toggle_on"}, {"id": "57", "key": "57", "name": "Prakash Kharya", "presence": "present", "presence_color": "green darken-2", "title": "17.  Prakash Kharya", "toggle": "toggle_on"}, {"id": "58", "key": "58", "name": "Zubin Mehta", "presence": "present", "presence_color": "green darken-2", "title": "18.  Zubin Mehta", "toggle": "toggle_on"}]
  return (
    <View style={styles.container}>
      <CustomListview
        itemList={DATA}
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
    paddingLeft: 8,
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