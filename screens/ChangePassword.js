import _ from 'lodash';
import React from 'react';
import { useEffect } from 'react';
import {
  StyleSheet, View, ActivityIndicator, Keyboard, KeyboardAvoidingView, Alert,
  Platform, TouchableWithoutFeedback
} from 'react-native';
import { Layout, Text, Input, Icon, Button } from '@ui-kitten/components';
import axios from 'axios';
import Toast from 'react-native-toast-message';



const ChangePassword = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [isLoading, setLoading] = React.useState(false);

  const [password, setPassword] = React.useState();
  const [password2, setPassword2] = React.useState();

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  useEffect(() => {
    return () => {

    };
  }, []);

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Change Password</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerStyle: {
        backgroundColor: '#ff8a65',
      },
    });
  });

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const changePassword = () => {
    if (password == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Password Name not Entered',
        text2: "Please enter Password",
      });
      return;
    }

    if (password2 == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Please Re-type password',
        text2: "Please Re-Type password",
      });
      return;
    }

    if (password !== password2) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Password do not match',
        text2: "Please Re-Type password",
      });
      return;
    }

    if (password.length < 4) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Password too Short',
        text2: "Please enter at least 4 characters long password",
      });
      return;
    }

    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Update update Password?",
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
                  <ActivityIndicator style={styles.loading} size='large' />
                </View>
              )
            }
            let url = serverIP.concat('/auth/change_password/');
            axios({
              method: "POST",
              url: url,
              data: {
                'user': userID,
                'new_password': password,
              }
            }).then(
              result => {
                const json = result.data;
                setLoading(false);
                console.log(json);
                let password_change = json.password_change;
                if (password_change == "Successful") {
                  Alert.alert(
                    "Password Changed", "Password Changed. Please Login with new Password",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('LoginScreen', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                          });
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }
                else {
                  Alert.alert(
                    "Password Update Failed. Please try again.", message,
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

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const doneIcon = (props) => (
    <Icon {...props} name='done-all-outline' />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Layout style={styles.container} level='1'>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        {isLoading ? <Layout style={styles.loading}>
          <ActivityIndicator size='large' />
        </Layout> : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Layout style={styles.mainContainer}>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    size='medium'
                    placeholder="Enter New password"
                    caption='Mandatory Should contain at least 4 characters'
                    status='primary'
                    accessoryRight={renderIcon}
                    autoCorrect={false}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry={secureTextEntry}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    size='medium'
                    placeholder="Re-enter (confirm) password"
                    caption='Mandatory'
                    status='primary'
                    accessoryRight={renderIcon}
                    autoCorrect={false}
                    onChangeText={text => setPassword2(text)}
                    secureTextEntry={secureTextEntry}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
                  <Button
                    size='medium'
                    status='info'
                    accessoryLeft={doneIcon}
                    onPress={changePassword}>
                    {"Change Password"}
                  </Button>
              </Layout>
            </TouchableWithoutFeedback>
          )}
      </Layout>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    width: "100%",
  },
  verticalSpace: {
    marginTop: 20
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mainContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center"
  },
  button: {
    margin: 2,
    width: "60%"
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 18,
      },
      android: {
        fontSize: 18,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
  hwDescription: {
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'top',
    borderColor: "cyan"
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

export default ChangePassword;
