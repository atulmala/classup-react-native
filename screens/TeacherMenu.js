import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';


const TeacherMenu = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  let params = {
    serverIP: serverIP,
    schoolID: schoolID,
    userID: userID,
    userName: userName,
    comingFrom: "TeacherMenu"
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

  const nextScreen = (screen) =>  {
    navigation.navigate(screen, params);
  };

  return (
    <View style={styles.container}>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, {backgroundColor: 'chocolate'}]} onPress={() => nextScreen('SelectClass')}>
          <Image
            source={require('../assets/LogoMakr-22kCL4.png')}
            style={styles.ImageIconStyle}
          />
          <Text style={styles.text} status='primary'>Take/Update Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[button, {backgroundColor: 'midnightblue'}]} onPress={() => nextScreen('SelectMonth')}>
          <Image
            source={require('../assets/attendance_summary1.png')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Attendance Summaries</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={[button, {backgroundColor: 'darkolivegreen'}]} >
          <Image
            source={require('../assets/bus.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text}>Bus Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[button, {backgroundColor: 'dodgerblue'}]} onPress={() => nextScreen('CommunicationCenter')}>
          <Image
            source={require('../assets/communication.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text}>Communications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={[button, {backgroundColor: 'goldenrod'}]} onPress={() => nextScreen('HWListTeacher')}>
          <Image
            source={require('../assets/homework.png')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Homework</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[button, {backgroundColor: '#827717'}]} onPress={() => nextScreen('LectureListTeacher')}>
          <Image
            source={require('../assets/lecture.png')}
            style={styles.ImageIconStyle2}
          />
          <Text style={styles.text}>Share Lecture</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, {backgroundColor: '#F8BBD0'}]} onPress={() => nextScreen('SelectExam')}>
          <Image
            source={require('../assets/test_exam.png')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Test/Exam Management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[button, {backgroundColor: 'rosybrown'}]} onPress={() => nextScreen('SelectClassCoSchol')}>
          <Image
            source={require('../assets/grades.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text}>Co Scholastic Grades</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={[button, {backgroundColor: 'lightsalmon'}]} onPress={() => nextScreen('SetSubjects')}>
          <Image
            source={require('../assets/subjects.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text} >Set My Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[button, {backgroundColor: 'indianred'}]} onPress = {() => nextScreen('ChangePassword')}>
          <Image
            source={require('../assets/password.jpg')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

let button = {
  width: '48%',
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
    color: 'white'
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
  
  font: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
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
})

export default TeacherMenu;