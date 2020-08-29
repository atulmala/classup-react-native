import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';


const TeacherMenu = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const _gotoSelectClass = () => {
    navigation.navigate('SelectClass', {
      serverIP: serverIP,
      schoolId: schoolId,
      userID: userID,
      userName: userName,
      comingFrom: "teacherMenu"

    });
  };

  const _gotoShowHW = () => {
    navigation.navigate('HWListTeacher', {
      serverIP: serverIP,
      schoolId: schoolId,
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
          schoolId: schoolId,
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
          <Text body>Attendance Summaries</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn3} >
        <Image
            source={require('../assets/school_bus.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body>Bus Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn4}>
        <Image
            source={require('../assets/communication_center.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body>Communication Center</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn5} onPress={_gotoShowHW}>
        <Image
            source={require('../assets/homework.png')}
            style={styles.ImageIconStyle}
          />
          <Text body>Homework List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn6}>
        <Image
            source={require('../assets/online_class.png')}
            style={styles.ImageIconStyle2}
          />
          <Text>Online Classes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn7} >
        <Image
            source={require('../assets/exam_management.png')}
            style={styles.ImageIconStyle}
          />
          <Text body>Test/Exam Management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn8}>
        <Image
            source={require('../assets/set_my_subjects.png')}
            style={styles.ImageIconStyle2}
          />
          <Text body>Set My Subjects</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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
  },
  btn1: {
    backgroundColor: '#FFCDD2',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn2: {
    backgroundColor: '#F8BBD0',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn3: {
    backgroundColor: '#CE93D8',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn4: {
    backgroundColor: '#B39DDB',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn5: {
    backgroundColor: '#BBDEFB',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn6: {
    backgroundColor: '#90CAF9',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'

  },

  btn7: {
    backgroundColor: '#81D4FA',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'

  },

  btn8: {
    backgroundColor: '#80DEEA',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
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
  FacebookStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'cornflowerblue',
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 10,
    margin: 5,
  },
  TextStyle: {
    color: 'white',
    fontSize: 18,
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