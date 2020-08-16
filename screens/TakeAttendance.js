import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, ActivityIndicator, FlatList, Switch, Image } from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { markAbsent, markPresent } from '../redux/reducer';

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
  const presentCount = useSelector(state => state);
  const absentCount = useSelector(state => state);
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(true);
  
  const [studentList] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentStudent, setPresentStudent] = useState(0);
  const [absentStudent, setAbsentStudent] = useState(0);

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
        for (var i = 0; i < absentees.data.length; i++) {
          absenteeList.push(absentees.data[i].student);
        }

        total = students.data.length;
        absent = absentees.data.length;
        present = total - absentees.data.length;
        console.log("total students = ", total);
        console.log("present = ", present);
        console.log("absent = ", absent);
        setTotalStudents(total);
        setPresentStudent(present);
        setAbsentStudent(absent);
        console.log("presentStudent = ", presentStudent);
        console.log("absentStudent = ", absentStudent);
        const initializeAbsent = absent => dispatch(initializeAbsent(absent));
        const initializePresent = present => dispatch(initializePresent(present));

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

  const CustomRow = ({ title, index }) => {
    const [absentCount, setAbsentCount] = useState(absent);
    const [presentCount, setPresentCount] = useState(present);
    const [isEnabled, setIsEnabled] = useState(false);

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
                  console.log("student ", student.title, " will be marked ", value);
                  student.presence = value;
                }
              }
              if (value) {
                setPresentCount(presentCount + 1);
                markPresent(presentCount + 1);
                setAbsentCount(absentCount - 1);
                markAbsent(absentCount - 1);
              }
              else {
                setPresentCount(presentCount - 1);
                markPresent(presentCount - 1);
                setAbsentCount(absentCount + 1);
                markAbsent(absentCount + 1);
              }
              console.log(value)
              console.log(index)
            }}
          />
        </View>
      </View>)
  };

  const Header = ({present, absent}) => {
    return (
      <View >
        <View style={styles.parallel}>
          <Text style={styles.baseText}>
            Class:
              <Text style={styles.innerText}> {selectedClass} - {selectedSection}</Text>
          </Text>
          <Text style={styles.baseText}>
            Date:
              <Text style={styles.innerText}> {selectedDay} / {selectedMonth} / {selectedYear}</Text>
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
          { <Text style={styles.baseText}>
            Present:
              <Text style={styles.innerPresentText}> {present}</Text>
          </Text> }
          {<Text style={styles.baseText}>
            Absent:
              <Text style={styles.innerAbsentText}> {absent}</Text>
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

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator size='large' /> : <Header data={{presentStudent, absentStudent}}/>}
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
  }
});

export default TakeAttendance;