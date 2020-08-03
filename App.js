import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from "expo-constants";
const { manifest } = Constants;
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';

const Stack = createStackNavigator();

function LoginScreen() {
  var login_id = "";
  var password = "";
  var toastMessage = "";

  const _onPressLogin = () => {
    if (login_id == "") {
      toastMessage = "Please enter Login ID";
      Toast.show({
        type: 'error',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        text1: 'Error: Login ID Missing',
        text2: toastMessage,
      });
      return;
    }
    if (password == "") {
      toastMessage = "Please enter Password";
      Toast.show({
        type: 'error',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        text1: 'Error: Password Missing',
        text2: toastMessage,
      });
      return;
    }
    // let url = 'https://wwww.classupclient.com/auth/login1/';
    // let url = 'http://10.0.2.2:8000/auth/login1/';
    let url = 'http://127.0.0.1:8000/auth/login1/';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'user': login_id,
        'password': password,
        'device_type': Device.brand,
        'model': Device.manufacturer,
        'os': Device.osName,
        'size': 'standard',
        'resolution': 'standard'
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.login == "successful") {
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: json.welcome_message,
          });
        }
        else {
          Toast.show({
            type: 'error',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            text1: 'Login Failed',
            text2: 'Either Login id or Password in Incorrect',
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <Text style={styles.logo}>ClassUp</Text>
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText}
          defaultValue={login_id}
          placeholder="Enter Login ID"
          placeholderTextColor="#e8eaf6"
          keyboardType="email-address"
          onChangeText={text => login_id = text} />
      </View>
      <View style={styles.inputView} >
        <TextInput
          secureTextEntry
          style={styles.inputText}
          defaultValue={password}
          placeholder="Enter Password"
          placeholderTextColor="#e8eaf6"
          onChangeText={text => password = text} />
      </View>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={_onPressLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2dfdb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#1b5e20",
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    fontSize: 18,
    color: "white"
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 10
  },
  loginText: {
    color: "white"
  },
  forgot: {
    marginTop: 15,
    color: "#1a237e",
    fontSize: 18,
    fontStyle: "italic"
  },
});
