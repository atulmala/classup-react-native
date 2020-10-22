import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Colors from '../Constants/colors';

const AdminMenu = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const testPress = () => {
    Alert.alert('was pressed');
    console.log('was pressed');
  };

  let params = {
    serverIP: serverIP,
    schoolID: schoolID,
    userID: userID,
    userName: userName,
    comingFrom: "AdminMenu"
  };

  const nextScreen = (screen) => {
    navigation.navigate(screen, params);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.StudentName}>Welcome Admin</Text>
      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn1} onPress={testPress}>
          <Text style={styles.font}>Teacher Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2} onPress={ () => {nextScreen('SelectClassesAdmin')}}>
          <Text style={styles.font}>Send Bulk SMS</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn3} onPress={() => {nextScreen('SelectDate')}}>
          <Text style={styles.font}>Daily Attendance Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn4}>
          <Text style={styles.font}>Update Student</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn5} onPress={testPress}>
          <Text style={styles.font}>Add Teacher</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn6}>
          <Text style={styles.font}>Update Teacher</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

let button =  {
  width: '48%',
  margin: 5,
  padding: 20,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightBlue,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%"
  },

  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 100
  },

  btn1: {
    backgroundColor: 'blueviolet',
    ...button
  },

  btn2: {
    backgroundColor: 'brown',
    ...button
  },

  btn3: {
    backgroundColor: 'darksalmon',
    ...button
  },

  btn4: {
    backgroundColor: 'forestgreen',
    ...button
  },

  btn5: {
    backgroundColor: 'goldenrod',
    ...button
  },

  btn6: {
    backgroundColor: 'orangered',
    ...button
  },

  font: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: "white"
  },

  StudentName: {
    alignSelf: 'flex-start',
    margin: 25,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'steelblue'
  }
})

export default AdminMenu