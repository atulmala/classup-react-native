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

  const nextScreen = (screen) =>  {
    navigation.navigate(screen, params);
  };

  return (
    <View style={styles.container}>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, {backgroundColor: 'chocolate'}]} onPress={() => nextScreen('SelectClass')}>
          <Image
            source={require('../assets/attendance.png')}
            style={styles.ImageIconStyle}
          />
          <Text style={styles.text} status='primary'>Take/Update Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[button, {backgroundColor: 'midnightblue'}]}>
          <Image
            source={require('../assets/attendance_summary.png')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Attendance Summaries</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={[button, {backgroundColor: 'darkolivegreen'}]} >
          <Image
            source={require('../assets/school_bus.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body style={styles.text}>Bus Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[button, {backgroundColor: 'dodgerblue'}]} onPress={() => nextScreen('CommunicationCenter')}>
          <Image
            source={require('../assets/communication_center.png')}
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

        <TouchableOpacity style={[button, {backgroundColor: 'brown'}]} onPress={() => nextScreen('LectureListTeacher')}>
          <Image
            source={require('../assets/online_class.png')}
            style={styles.ImageIconStyle2}
          />
          <Text style={styles.text}>Online Classes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, {backgroundColor: 'darkorchid'}]} onPress={() => nextScreen('SelectExam')}>
          <Image
            source={require('../assets/exam4.png')}
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
        <TouchableOpacity style={[button, {backgroundColor: 'indianred'}]} >
          <Image
            source={require('../assets/password.jpg')}
            style={styles.ImageIconStyle}
          />
          <Text body style={styles.text}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[button, {backgroundColor: 'lightsalmon'}]}>
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