import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../Constants/colors';

const ParentMenu = ({ route, navigation }) => {
  console.log('inside ParentMenu');
  
  const testPress = () => {
    Alert.alert('was pressed');
    console.log('was pressed');
  };

  const { url } = route.params;
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { feeDefaultStatus } = route.params;
  const { welcomeMessage } = route.params;

  const showToast = () => {
    if (feeDefaultStatus == "yes") {
      console.log('FeeDefaulter');
      Alert.alert(
        "Fee Outstanding!", welcomeMessage,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ],
        { cancelable: false }
      );
      Toast.show({
        type: 'error',
        text1: 'Fee Status: Pending',
        text2: welcomeMessage,
      });
      
    }
    else {
      console.log('Fee status good');
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: welcomeMessage
      });
    }
  };
  showToast();

  const _gotoSelectSubject = () => {
    navigation.navigate('SelectSubject', {
      serverIP: serverIP,
      schoolId: schoolId,
      userID: userID,
      userName: userName,
      comingFrom: ""
    });
  };

return (
  <View style={styles.container}>
    {
      showToast
    }
    <Text style={styles.StudentName}>Student Name</Text>
    <View style={styles.parallel}>
      <TouchableOpacity style={styles.btn1} onPress={testPress}>
        <Text style={styles.font}>Month Wise Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn2}>
        <Text style={styles.font}>Time Table</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.parallel}>
      <TouchableOpacity style={styles.btn3} onPress={_gotoSelectSubject}>
        <Text style={styles.font}>Homework</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn4}>
        <Text style={styles.font}>Test & Exams</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.parallel}>
      <TouchableOpacity style={styles.btn5} onPress={testPress}>
        <Text style={styles.font}>Communication Center</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn6}>
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
    backgroundColor: '#EF7373',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn2: {
    backgroundColor: '#FFAF49',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn3: {
    backgroundColor: '#FDD835',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn4: {
    backgroundColor: '#80CBC4',//4DD0E1
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn5: {
    backgroundColor: '#4DD0E1',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn6: {
    backgroundColor: '#CE93D8',//4DB6AC
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
    textAlign: 'center'
  },

  StudentName: {
    alignSelf: 'flex-start',
    margin: 25,
    fontWeight: 'bold',
    fontSize: 20
  }
})

export default ParentMenu