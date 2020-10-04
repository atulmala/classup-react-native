import React from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../Constants/colors';

const TestExams = ({ route, navigation }) => {
  const selectExam = (comingFrom) => {
    navigation.navigate('SelectExam', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      comingFrom: comingFrom
    });
  };

  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn1} onPress={
          () => {
            selectExam("scheduleTest")
          }
        }>
          <Image
            source={require('../assets/schedule_test.png')}
            style={styles.ImageIconStyle}
          />
          <Text style={styles.font}>   Schedule Test</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn3} >
          <Image
            source={require('../assets/marks_entry.png')}
            style={styles.ImageIconStyle}
          />
          <Text style={styles.font}>   Enter Test Marks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn5} >
          <Image
            source={require('../assets/grades.png')}
            style={styles.ImageIconStyle}
          />
          <Text style={styles.font}>   Enter Co Scholastic Grades</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

let button = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '90%',
  height: '80%',
  margin: 5,
  padding: 20,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },

  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100
  },
  btn1: {
    ...button,
    backgroundColor: 'olive',
  },
  btn3: {
    ...button,
    backgroundColor: '#EF7373',
  },
  btn5: {
    ...button,
    backgroundColor: '#4DD0E1',
  },
  font: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 40,
    width: 40,
    resizeMode: 'stretch',
  },
})

export default TestExams