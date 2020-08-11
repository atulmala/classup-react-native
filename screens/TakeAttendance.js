import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Switch, Image } from 'react-native';
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

  var absenteeList = [];
  var total;
  var present;
  var absent;

  const [isLoading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);

  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setAttendance('A');
  };

  const [attendance, setAttendance] = useState('P');

  const getStudentList = () => {
    return axios.get(serverIP.concat("/student/list/", schoolId, "/", selectedClass, "/", selectedSection, "/"));
  };

  const getAbsenteeList = () => {
    return axios.get(serverIP.concat("/attendance/retrieve/", schoolId, "/", selectedClass, "/", selectedSection,
      "/", selectedSubject, "/", selectedDay, "/", selectedMonth, "/", selectedYear, "/"));
  };

  useEffect(() => {
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
          student.title = s_no + ". " +
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
        setLoading(false);
      }));
  }, []);

  const CustomRow = ({ title }) => (
    <View style={styles.containerRow}>
      <View style={styles.container_text}>
        <Text style={styles.title}>
          {title}
        </Text>
      </View>
      <Image
        style={styles.tinyLogo}
        source={require('../assets/P.png')}
      />
      <View style={styles.attendanceSwitch}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
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
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <CustomListview
            itemList={studentList}
          />)}
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
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 6,
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Cochin'
  },
  tinyLogo: {
    margin: 6,
    width: 16,
    height: 16,
  },
  prsent: {
    color: '#000',
    fontSize: 18,
    marginRight: 4
  },
  absent: {
    color: '#000',
    fontSize: 18,
    color: 'red'
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  attendanceSwitch: {
    flex: 1,
    marginRight: 12
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

export default TakeAttendance;