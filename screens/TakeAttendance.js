import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity,
  FlatList, Switch, Image, Alert
} from 'react-native';
import axios from 'axios';
import { AttendanceContext, AttendanceContextProvider } from './AttendanceContext';

const TakeAttendance = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { selectedDay } = route.params;
  const { selectedMonth } = route.params;
  const { selectedYear } = route.params;
  const { selectedClass } = route.params;
  const { selectedSection } = route.params;
  const { selectedSubject } = route.params;

  var [absenteeList] = useState([]);
  var [correctionList] = useState([]);
  var total;

  const [isLoading, setLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(true);

  const [studentList] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentCount, setPresentCount] = useState(0);

  const getStudentList = () => {
    return axios.get(serverIP.concat("/student/list/", schoolID, "/", selectedClass, "/", selectedSection, "/"));
  };

  const getAbsenteeList = () => {
    return axios.get(serverIP.concat("/attendance/retrieve/", schoolID, "/", selectedClass, "/", selectedSection,
      "/", selectedSubject, "/", selectedDay, "/", selectedMonth, "/", selectedYear, "/"));
  };

  useEffect(() => {
    axios.all([getStudentList(), getAbsenteeList()]).then(
      axios.spread(function (students, absentees) {
        for (var i = 0; i < absentees.data.length; i++) {
          absenteeList.push(absentees.data[i].student);
        }
        total = students.data.length;

        setTotalStudents(total);
        setPresentCount(total - absentees.data.length);

        for (i = 0; i < students.data.length; i++) {
          let student = {};
          let s_no = i + 1;
          student.id = students.data[i].id;
          if (absenteeList.indexOf(student.id) > -1) {
            student.presence = false;
          } else {
            student.presence = true;
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
        setLoading(false);
      }));
  }, []);

  const attendanceTaken = () => {
    let url = serverIP.concat("/attendance/attendance_taken/", schoolID, "/", selectedClass, "/", selectedSection, "/",
      selectedSubject, "/", selectedDay, "/", selectedMonth, "/", selectedYear, "/", userID, "/");
    return axios.post(url);
  };

  const submitAttendance = () => {
    let absentees = {};
    for (var i = 0; i < absenteeList.length; i++) {
      absentees[absenteeList[i]] = absenteeList[i];
    }
    let url = serverIP.concat("/attendance/update1/", schoolID, "/", selectedClass, "/", selectedSection, "/",
      selectedSubject, "/", selectedDay, "/", selectedMonth, "/", selectedYear, "/", userID, "/");
    return axios.post(url, absentees);
  };

  const submitCorrection = () => {
    let corrections = {};
    for (var i = 0; i < correctionList.length; i++) {
      corrections[correctionList[i]] = correctionList[i];
    }
    let url = serverIP.concat("/attendance/delete2/", schoolID, "/", selectedClass, "/", selectedSection, "/",
      selectedSubject, "/", selectedDay, "/", selectedMonth, "/", selectedYear, "/");
    return axios.post(url, corrections);
  };

  const processAttendance = () => {
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to submit this Attendance?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            setLoading(true);
            {
              isLoading && (
                <View>
                  <ActivityIndicator style={styles.loading} size='large' />
                </View>
              )
            }
            axios
              .all([attendanceTaken(), submitAttendance(), submitCorrection()])
              .then(
                axios.spread(function (res1, res2, res3) {
                  setLoading(false);
                  Alert.alert(
                    "Attendance Done",
                    "Attendance Submitted to Server.",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('TeacherMenu', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                            selectedSubject: selectedSubject,
                            comingFrom: "TakeAttendance"
                          });
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                })
              );
          }
        }
      ],
      { cancelable: false }
    );
  };

  const CustomRow = ({ title, index }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [present, setPresent] = useContext(AttendanceContext);

    return (
      <View style={styles.containerRow}>
        <View style={styles.container_text}>
          <Text style={styles.title}>
            {title.title}
          </Text>
        </View>
        <Image
          style={styles.tinyLogo}
          source={title.presence ? require('../assets/P.png') : require('../assets/A.png')}
        />

        <View style={styles.attendanceSwitch}>
          <Switch
            trackColor={{ false: "#ffb6c1", true: "#8fbc8f" }}
            thumbColor={title.presence ? "#ffe4b5" : "#f4f3f4"}
            ios_backgroundColor="#f08080"
            value={title.presence}
            onValueChange={(value) => {
              setIsEnabled(previousState => !previousState);
              for (student of studentList) {
                if (student.id == index) {
                  student.presence = value;
                  if (value) {
                    setPresent(present + 1);
                    let position = absenteeList.indexOf(student.id);
                    if (position > -1) {
                      // this student was in the absentee list. will have to be marked as present
                      absenteeList.splice(position, 1);
                      correctionList.push(student.id);
                    }
                  }
                  else {
                    setPresent(present - 1);
                    absenteeList.push(student.id)
                  }
                  break;
                }
              }
            }}
          />
        </View>
      </View>)
  };

  const Header = () => {
    const [present, setPresent] = useContext(AttendanceContext);
    {
      if (firstTime) {
        setPresent(presentCount);
        setFirstTime(false);
      }
      else {
        setPresent(present);
      }
    }
    return (
      <View >
        <View style={styles.parallel}>
          <Text style={styles.baseText}>
            Class:
              <Text style={styles.innerText}> {selectedClass} - {selectedSection}</Text>
          </Text>
          <Text style={styles.baseText}>
            Date:
              <Text style={styles.innerText}> {selectedDay}/{selectedMonth}/{selectedYear}</Text>
          </Text>
          <Text style={styles.baseText}>
            Subject:
              <Text style={styles.innerText}> {selectedSubject}</Text>
          </Text>
        </View>
        <View style={styles.parallel}>
          <Text style={styles.baseText}>
            Total:
              <Text style={styles.innerTotalText}> {totalStudents}</Text>
          </Text>
          {<Text style={styles.baseText}>
            Present:
              <Text style={styles.innerPresentText}> {present}</Text>
          </Text>}
          {<Text style={styles.baseText}>
            Absent:
              <Text style={styles.innerAbsentText}> {totalStudents - present}</Text>
          </Text>}
        </View>
      </View>
    )
  }

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow
            title={item}
            index={item.id}

          />}
        />
      </View>
    )
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <TouchableOpacity style={styles.nextButton} onPress={() => processAttendance()}>
          {!isLoading && <Text style={styles.nextText}>Submit</Text>}
        </TouchableOpacity>
    });
  });

  return (
    <AttendanceContextProvider>
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator size='large' color='#0097A7'/> : <Header />}
        {isLoading ? <View style={styles.loading}>
          <ActivityIndicator size='large' color='#0097A7'/>
        </View> : (
            <CustomListview
              itemList={studentList}
            />)}
      </View>
    </AttendanceContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bbdefb'
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 25,
    backgroundColor: '#ffe4e1'
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 1,
    marginBottom: 1,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Verdana'
  },
  tinyLogo: {
    margin: 6,
    width: 16,
    height: 18,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  baseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#708090',
    margin: 4
  },
  innerTotalText: {
    fontSize: 16,
    color: '#00bfff',
    margin: 4
  },
  innerPresentText: {
    fontSize: 16,
    color: '#228b22',
    margin: 4
  },
  innerAbsentText: {
    fontSize: 16,
    color: 'red',
    margin: 4
  },
  innerText: {
    fontSize: 16,
    color: '#4b0082',
    margin: 4
  },
  attendanceSwitch: {
    ...Platform.select({
      ios: {
        flex: 0
      },
      android: {
        flex: 1
      }
    }),
    marginRight: 6,
    marginLeft: 6
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
  },
  nextButton: {
    backgroundColor: 'lavenderblush',
    height: 25,
    margin: 10,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'indigo',
  }
});

export default TakeAttendance;