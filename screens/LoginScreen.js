import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, } from 'react-native';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';
import OneSignal from 'react-native-onesignal';

var player_id;

function componentWillUnmount() {
  OneSignal.removeEventListener('received', this.onReceived);
  OneSignal.removeEventListener('opened', this.onOpened);
  OneSignal.removeEventListener('ids', this.onIds);
}

function onReceived(notification) {
  console.log("Notification received: ", notification);
}

function onOpened(openResult) {
  console.log('Message: ', openResult.notification.payload.body);
  console.log('Data: ', openResult.notification.payload.additionalData);
  console.log('isActive: ', openResult.notification.isAppInFocus);
  console.log('openResult: ', openResult);
}

function onIds(device) {
  player_id = device.userId;
}

function myiOSPromptCallback(permission) {
  // do something with permission value
}

const LoginScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [loginID, setLoginID] = useState("");
  const [password, setPassword] = useState("");
  var toastMessage = "";


  const _onPressLogin = () => {
    if (loginID == "") {
      toastMessage = "Please enter Login ID";
      Toast.show({
        type: 'error',
        position: 'top',
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
    setLoading(true);
    // let server_ip = 'https://wwww.classupclient.com;
    let serverIP = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
    let url = serverIP.concat('/auth/login1/');
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'user': loginID,
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
        setLoading(false);
        console.log(json);
        if (json.login == "successful") {
          // OneSignal set up
          OneSignal.setLogLevel(6, 0);

          // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
          OneSignal.init("4f62be3e-1330-4fda-ac23-91757077abe3", {
            kOSSettingsKeyAutoPrompt: false,
            kOSSettingsKeyInAppLaunchURL: false,
            kOSSettingsKeyInFocusDisplayOption: 2
          });
          OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

          // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
          OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

          OneSignal.addEventListener('received', onReceived);
          OneSignal.addEventListener('opened', onOpened);
          OneSignal.addEventListener('ids', onIds);

          // check whether the user account is active or not
          if (json.user_status != "active") {
            Toast.show({
              type: 'error',
              text1: 'Your ClassUp Account is in Suspended!',
              text2: 'Please Contact the School Management for further details.',
            });
          }
          else {
            Toast.show({
              type: 'success',
              text1: 'Login Successful',
              text2: json.welcome_message,
            });

            // send the device/player_id for push notification to backend
            let platform = Platform.OS;
            console.log(platform);
            url = serverIP.concat('/auth/map_device_token/');
            fetch(url, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                'user': loginID,
                'device_type': platform,
                'device_token': "N/A",
                'player_id': player_id
              })
            });
            if (json.is_staff == "true") {
              if (json.subscription != "active") {
                Toast.show({
                  type: 'error',
                  text1: 'School Subscription Expired!',
                  text2: 'Please Contact the School Management for further details.',
                });
              }
              else {
                // admin user
                if (json.school_admin == "true") {
                  navigation.navigate('AdminMenu', {
                    serverIP: serverIP,
                    schoolId: json.school_id,
                    userID: loginID,
                    userName: json.user_name
                  });
                }
                else {
                  // teacher user
                  navigation.navigate('TeacherMenu', {
                    serverIP: serverIP,
                    schoolId: json.school_id,
                    userID: loginID,
                    userName: json.user_name
                  });
                }
              }
            }
            else {
              // parent user first check fee default status
              let feeDefaultStatus = json.fee_defaulter;
              console.log('feeDefaultStatus = ', feeDefaultStatus);
              if (feeDefaultStatus == "yes") {
                let welcomeMessage = json.welcome_message;
                let stopAccess = json.stop_access;
                if (stopAccess == "false") {
                  navigation.navigate('ParentMenu', {
                    serverIP: serverIP,
                    schoolId: json.school_id,
                    userID: loginID,
                    userName: json.user_name,
                    feeDefaultStatus: feeDefaultStatus,
                    welcomeMessage: welcomeMessage,

                  });
                }
                else {
                  Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Attention: Fee Oustaning',
                    text2: welcomeMessage,
                  });
                }
              }
              else {
                navigation.navigate('ParentMenu', {
                  serverIP: serverIP,
                  userName: json.user_name,
                  feeDefaultStatus: feeDefaultStatus,
                  welcomeMessage: welcomeMessage
                });
              }
            }
          }
        }
        else {
          Toast.show({
            type: 'error',
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
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <Text style={styles.logo}>ClassUp</Text>
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText}
          defaultValue={loginID}
          placeholder="Enter Login ID"
          placeholderTextColor="#e8eaf6"
          keyboardType="email-address"
          onChangeText={text => setLoginID(text)} />
      </View>
      <View style={styles.inputView} >
        <TextInput
          secureTextEntry
          style={styles.inputText}
          defaultValue={password}
          keyboardType="email-address"
          placeholder="Enter Password"
          placeholderTextColor="#e8eaf6"
          onChangeText={text => setPassword(text)} />
      </View>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={_onPressLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      {isLoading && <View style={styles.loading}><ActivityIndicator size='large' /></View>}
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

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
