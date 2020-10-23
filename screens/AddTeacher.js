import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet, ScrollView, View, ActivityIndicator, Keyboard, KeyboardAvoidingView, Image, Alert,
  Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import {
  IndexPath, Layout, Text, Select, Input, Button, SelectItem, Icon
} from '@ui-kitten/components';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const showEvent = Platform.select({
  android: 'keyboardDidShow',
  default: 'keyboardWillShow',
});

const hideEvent = Platform.select({
  android: 'keyboardDidHide',
  default: 'keyboardWillHide',
});

const AddTeacher = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [placement, setPlacement] = React.useState('bottom');
  const [isLoading, setLoading] = React.useState(false);

  const [teacherName, setTeacherName] = React.useState("");
  const [teacherMobile, setTeacherMobile] = React.useState("");
  const [login, setLogin] = useState("");

  const Upload = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={addTeacher}>
          <Image
            source={require('../assets/add_teacher.png')}
            style={{
              width: 30,
              height: 30,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Add Teacher</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerRight: () => <Upload />,
      headerStyle: {
        backgroundColor: '#827717',
      },
    });
  });

  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setPlacement('top');
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setPlacement('bottom');
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const addTeacher = () => {
    if (teacherName == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Teacher Name not Entered',
        text2: "Please enter Teacher Name",
      });
      return;
    }

    if (teacherMobile == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Teacher Mobile not Entered',
        text2: "Please enter Teacher Mobile",
      });
      return;
    }

    if (teacherMobile.length != 10) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Invalid Mobile Number',
        text2: "Please enter a valid 10-digit Mobile Number",
      });
      return;
    }

    if (login == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Login ID for Teacher not Entered',
        text2: "Please enter Login ID for Teacher",
      });
      return;
    }
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Add this Teacher?",
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
            let url = serverIP.concat('/teachers/add_teacher/');
            axios({
              method: "POST",
              url: url,
              data: {
                'user': userID,
                'school_id': schoolID,
                'employee_id': teacherMobile,
                'full_name': teacherName,
                'email': login,
                'mobile': teacherMobile,
              }
            }).then(
              result => {
                const json = result.data;

                setLoading(false);
                console.log(json);
                let status = json.status;
                let message = json.message
                if (json.status == "success") {
                  Alert.alert(
                    "Teacher Added",
                    "Login ID and Password sent via SMS.",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('AdminMenu', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                            comingFrom: "SendMessage"
                          });
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }
                else {
                  Alert.alert(
                    "Teacher Addition Failed", message,
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

  const personIcon = (props) => (
    <Icon {...props} name='person-outline'/>
  );
  const phoneIcon = (props) => (
    <Icon {...props} name='phone-outline'/>
  );
  const loginIcon = (props) => (
    <Icon {...props} name='at-outline'/>
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
                    editable
                    placeholder="Teacher Full Name (Mandatory)"
                    status='primary'
                    accessoryLeft={personIcon}
                    onChangeText={text => setTeacherName(text)}
                    placement={placement}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    editable
                    placeholder="10-digit Mobile Number(Mandatory)"
                    status='success'
                    accessoryLeft={phoneIcon}
                    keyboardType="phone-pad"
                    onChangeText={text => setTeacherMobile(text)}
                    placement={placement}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    editable
                    placeholder="Teacher Login (Mandatory)"
                    status='warning'
                    accessoryLeft={loginIcon}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={text => setLogin(text)}
                    placement={placement}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
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
    marginTop: 10
  },
  mainContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 16,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
  hwDescription: {
    marginLeft: 5,
    marginRight: 5,
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

export default AddTeacher;
