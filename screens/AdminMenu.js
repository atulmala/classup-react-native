import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Colors from '../Constants/colors';

function AdminMenu ({ rout, navigation }) {

  const testPress = () => {
    Alert.alert('was pressed')
    console.log('was pressed')
  };
  return (
    <View style={styles.container}>
      <Text style={styles.StudentName}>Welcome Admin</Text>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn1} onPress={testPress}>
          <Text style={styles.font}>Teacher Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn2}>
          <Text style={styles.font}>Send Bulk SMS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn3} onPress={testPress}>
          <Text style={styles.font}>Notice Via Pic/Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn4}>
          <Text style={styles.font}>Daily Attendance Summary</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn5} onPress={testPress}>
          <Text style={styles.font}>Add Student</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn6}>
          <Text style={styles.font}>Update Student</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn7} onPress={testPress}>
          <Text style={styles.font}>Add Teacher</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn8}>
          <Text style={styles.font}>Update Teacher</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn9}>
          <Text style={styles.font}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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
    justifyContent: 'space-evenly',
    height: 100
  },

  btn1: {
    backgroundColor: '#EF5350',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn2: {
    backgroundColor: '#EC407A',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn3: {
    backgroundColor: '#AB47BC',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn4: {
    backgroundColor: '#7E57C2',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn5: {
    backgroundColor: '#5C6BC0',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn6: {
    backgroundColor: '#42A5F5',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'

  },

  btn7: {
    backgroundColor: '#29B6F6',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'

  },

  btn8: {
    backgroundColor: '#26C6DA',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },


  btn9: {
    backgroundColor: '#FFA000',//4DB6AC
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'

  },

  font: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: "white"
  },

  StudentName: {
    alignSelf: 'flex-start',
    margin: 25,
    fontWeight: 'bold',
    fontSize: 20
  }
})

export default AdminMenu