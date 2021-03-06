import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';

var player_id;

function onReceived(notification) {
}

function onOpened(openResult) {

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
    let serverIP = 'https://www.classupclient.com';
    // let serverIP = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
    let url = serverIP.concat('/auth/login1/');
    axios({
      method: "POST",
      url: url,
      data: {
        'user': loginID,
        'password': password,
        'device_type': Device.brand,
        'model': Device.manufacturer,
        'os': Device.osName,
        'size': 'standard',
        'resolution': 'standard'
      }
    }).then(
      result => {
        const json = result.data;

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

          let welcomeMessage = json.welcome_message;

          // check whether the user account is active or not
          if (json.user_status != "active") {
            Toast.show({
              type: 'error',
              text1: 'Your ClassUp Account is in Suspended!',
              text2: 'Please Contact the School Management for further details.',
            });
          }
          else {
            // send the device/player_id for push notification to backend
            let platform = Platform.OS;
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
                    schoolID: json.school_id,
                    userID: loginID,
                    userName: json.user_name
                  });
                }
                else {
                  // teacher user
                  navigation.navigate('TeacherMenu', {
                    serverIP: serverIP,
                    schoolID: json.school_id,
                    userID: loginID,
                    userName: json.user_name
                  });
                }
              }
            }
            else {
              // parent user first check fee default status
              let feeDefaultStatus = json.fee_defaulter;
              if (feeDefaultStatus == "yes") {
                let stopAccess = json.stop_access;
                if (stopAccess == "false") {
                  navigation.navigate('SelectWard', {
                    serverIP: serverIP,
                    schoolID: json.school_id,
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
                navigation.navigate('SelectWard', {
                  serverIP: serverIP,
                  schoolID: json.school_id,
                  userID: loginID,
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

      },
      error => {
        setLoading(false);
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Server Error',
          text2: 'Some issues at Server End. Please try again after some time.',
        });
      }
    );
  };

  const forgotPassword = () => {
    let serverIP = 'https://www.classupclient.com';
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

    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Reset your Password?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            setLoading(true);
            {
              isLoading && (
                <View>
                  <ActivityIndicator style={styles.loading} size='large' color='#0097A7'/>
                </View>
              )
            }
            let url = serverIP.concat('/auth/forgot_password/');
            axios({
              method: "POST",
              url: url,
              data: {
                'user': loginID,
                'player_id': player_id,
              }
            }).then(
              result => {
                const json = result.data;
                setLoading(false);
                let status = json.forgot_password;
                if (status == "successful") {
                  Alert.alert(
                    "Reset Successful", "You will get new password within 15 min by SMS/Notification",
                    [
                      {
                        text: "OK", onPress: () => {

                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }
                else {
                  Alert.alert(
                    "Reset Failed.", "User does not exist. Please contact ClassUp Support",
                    [
                      {
                        text: "OK", onPress: () => {

                        }
                      }
                    ],
                    { cancelable: false }
                  );
                  console.error(error);
                }
              },
              error => {
                setLoading(false);
                console.log(error);
                Toast.show({
                  type: 'error',
                  text1: 'Server Error',
                  text2: 'Some issues at Server End. Please try again after some time.',
                });
              }
            );
          }
        }
      ],
      { cancelable: false }
    );
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
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text => setLoginID(text)} />
      </View>
      <View style={styles.inputView} >
        <TextInput
          secureTextEntry
          style={styles.inputText}
          defaultValue={password}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter Password"
          placeholderTextColor="#e8eaf6"
          onChangeText={text => setPassword(text)} />
      </View>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={_onPressLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={forgotPassword}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      {isLoading && <View style={styles.loading}><ActivityIndicator size='large' color='#0097A7'/></View>}
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
