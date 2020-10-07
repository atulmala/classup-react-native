import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';


const TeacherMenu = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const _gotoSelectClass = () => {
    navigation.navigate('SelectClass', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      comingFrom: "teacherMenu"
    });
  };

  const _gotoTestExams = () => {
    navigation.navigate('SelectExam', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      comingFrom: "teacherMenu"
    });
  };

  const _gotoShowHW = () => {
    navigation.navigate('HWListTeacher', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      comingFrom: "teacherMenu"
    });
  };

  const _selectClassCoSchol = () => {
    navigation.navigate('SelectClassCoSchol', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      comingFrom: "teacherMenu"
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('LoginScreen', {
          serverIP: serverIP,
          schoolID: schoolID,
          userID: userID,
          userName: userName,

        })}>
          <Text style={styles.nextText}>Logout</Text>
        </TouchableOpacity>
    });
  });
  return (
    <View style={styles.container}>
      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn1} onPress={_gotoSelectClass}>
          <Image
            source={require('../assets/attendance.png')}
            style={styles.ImageIconStyle}
          />
          <Text style={styles.text} status='primary'>Take/Update Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn2}>
          <Image
            source={require('../assets/attendance_summary.png')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Attendance Summaries</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn3} >
          <Image
            source={require('../assets/school_bus.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text}>Bus Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn4}>
          <Image
            source={require('../assets/communication_center.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text}>Communications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn5} onPress={_gotoShowHW}>
          <Image
            source={require('../assets/homework.png')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Homework</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn6}>
          <Image
            source={require('../assets/online_class.png')}
            style={styles.ImageIconStyle2}
          />
          <Text style={styles.text}>Online Classes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn7} onPress={_gotoTestExams}>
          <Image
            source={require('../assets/exam4.png')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Test/Exam Management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn8} onPress={_selectClassCoSchol}>
          <Image
            source={require('../assets/grades.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text}>Co Scholastic Grades</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn5} >
          <Image
            source={require('../assets/password.jpg')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn8}>
          <Image
            source={require('../assets/set_my_subjects.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text}>Set My Subjects</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

let button = {
  justifyContent: 'space-between',
  width: '45%',
  margin: 5,
  padding: 20,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 100
  },
  text: {
    margin: 4,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    color: 'midnightblue'
  },
  btn1: {
    ...button,
    backgroundColor: '#FFCDD2',
  },
  btn2: {
    ...button,
    backgroundColor: '#F8BBD0',
  },
  btn3: {
    ...button,
    backgroundColor: '#CE93D8',
  },
  btn4: {
    ...button,
    backgroundColor: '#B39DDB',
  },
  btn5: {
    ...button,
    backgroundColor: '#BBDEFB',
  },
  btn6: {
    ...button,
    backgroundColor: '#90CAF9',
  },
  btn7: {
    ...button,
    backgroundColor: 'burlywood',
  },
  btn8: {
    ...button,
    backgroundColor: '#80DEEA',
  },
  font: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: 'midnightblue'
  },
  nextButton: {
    backgroundColor: 'lavenderblush',
    height: 25,
    margin: 10,
    padding: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextText: {
    fontSize: 12,
    color: 'indigo',
  },
  TextStyle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
    marginRight: 4,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 40,
    width: 40,
    resizeMode: 'stretch',
  },
  ImageIconStyle2: {
    padding: 10,
    margin: 3,
    height: 45,
    width: 50,
    resizeMode: 'stretch',
  },
  SeparatorLine: {
    backgroundColor: '#fff',
    width: 0,
    height: 40,
  }
})

export default TeacherMenu;