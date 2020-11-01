import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet, View, ActivityIndicator, Keyboard, KeyboardAvoidingView, Image, Alert,
  Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { Layout, Text, Input, Select, SelectItem, Icon, IndexPath, CheckBox } from '@ui-kitten/components';
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

const UpdateTeacher = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { id } = route.params;
  const { name } = route.params;
  const { login } = route.params;
  const { mobile } = route.params;

  const [placement, setPlacement] = React.useState('bottom');
  const [isLoading, setLoading] = React.useState(false);

  const [teacherName, setTeacherName] = React.useState(name);
  const [teacherMobile, setTeacherMobile] = React.useState(mobile);

  const [classList] = useState([]);
  var selectedClass;
  const [selectedClassIndex, setSelectedClassIndex] = useState(new IndexPath(0));
  const displayClassValue = classList[selectedClassIndex.row];

  const [sectionList] = useState([]);
  var selectedSection;
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(new IndexPath(0));
  const displaySectionValue = sectionList[selectedSectionIndex.row];

  const [classTeacher, setClassTeacher] = React.useState(false);
  const [checked, setChecked] = useState(classTeacher);

  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  const getClassList = () => {
    return axios.get(serverIP.concat("/academics/class_list/", schoolID, "/"));
  };

  const getSectionList = () => {
    return axios.get(serverIP.concat("/academics/section_list/", schoolID, "/"));
  };

  const whetherClassTeacher = () => {
    return axios.get(serverIP.concat("/teachers/whether_class_teacher/", id, "/"));
  };

  useEffect(() => {
    axios.all([getClassList(), getSectionList(), whetherClassTeacher()]).then(
      axios.spread(function (classes, sections, ct) {
        classList.push("Select");
        for (var i = 0; i < classes.data.length; i++) {
          classList.push(classes.data[i].standard);
        }

        sectionList.push("Select");
        for (i = 0; i < sections.data.length; i++) {
          sectionList.push(sections.data[i].section);
        }

        let status = ct.data.status;
        if (status == "success") {
          let isClassTeacher = ct.data.is_class_teacher;
          if (isClassTeacher == "true") {
            setClassTeacher(true);
            setChecked(true);
            let theClass = ct.data.the_class;
            let classIdx = classList.indexOf(theClass);
            setSelectedClassIndex(new IndexPath(classIdx));

            let section = ct.data.section;
            let sectionIdx = sectionList.indexOf(section);
            setSelectedSectionIndex(new IndexPath(sectionIdx));
          }
        }
        const keyboardShowListener = Keyboard.addListener(showEvent, () => {
          setPlacement('top');
        });

        const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
          setPlacement('bottom');
        });
        setLoading(false);

        return () => {
          keyboardShowListener.remove();
          keyboardHideListener.remove();
        };

      })
    );
  }, []);

  const Upload = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={updateTeacher}>
          <Image
            source={require('../assets/update-teacher1.png')}
            style={{
              width: 35,
              height: 34,
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteTeacher}>
          <Image
            source={require('../assets/delete-teacher1.png')}
            style={{
              width: 35,
              height: 35,
              marginLeft: 10,
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
        <Text style={styles.headerText}>Update Teacher</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerRight: () => <Upload />,
      headerStyle: {
        backgroundColor: '#64b5b6',
      },
    });
  });

  const updateTeacher = () => {
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

    if (checked)  {
      if (selectedClassIndex.row === 0) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error: Class Not Selected',
          text2: "Teacher set as Class Teacher but Class not selected. Please Select a Class",
        });
        return;
      }
      else  {
        selectedClass = classList[selectedClassIndex.row];
      }
  
      if (selectedSectionIndex.row === 0) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error: Section Not Selected',
          text2: "Teacher set as Class Teacher but Section not selected. Please Select a Section",
        });
        return;
      }
      else  {
        selectedSection = sectionList[selectedSectionIndex.row];
      }
    }
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Update this Teacher?",
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
            let url = serverIP.concat('/teachers/update_teacher/');
            axios({
              method: "POST",
              url: url,
              data: {
                'school_id': schoolID,
                'teacher_id': id,
                'teacher_login': login,
                'teacher_mobile': teacherMobile,
                'teacher_name': teacherName,
                'is_class_teacher': checked? 'true': 'false',
                'the_class': selectedClass,
                'section': selectedSection,
              }
            }).then(
              result => {
                const json = result.data;
                setLoading(false);
                let status = json.status;
                let message = json.message
                if (status == "success") {
                  Alert.alert(
                    "Teacher Updated", message,
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('AdminMenu', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                            comingFrom: "AdminMenu"
                          });
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }
                else {
                  Alert.alert(
                    "Teacher Update Failed. Please try again.", message,
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

  const deleteTeacher = () => {
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Delete this Teacher?",
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
            let url = serverIP.concat('/teachers/delete_teacher/');
            axios({
              method: "POST",
              url: url,
              data: {
                'teacher_id': id,
              }
            }).then(
              result => {
                const json = result.data;
                setLoading(false);
                let status = json.status;
                if (status == "success") {
                  Alert.alert(
                    "Teacher Deleted", "Teacher Deleted",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('AdminMenu', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                            comingFrom: "AdminMenu"
                          });
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }
                else {
                  Alert.alert(
                    "Teacher Deletions Failed. ", "Teacher Deletion Failed. Please try again.",
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

  }

  const personIcon = (props) => (
    <Icon {...props} name='person-outline' />
  );
  const phoneIcon = (props) => (
    <Icon {...props} name='phone-outline' />
  );
  const loginIcon = (props) => (
    <Icon {...props} name='at-outline' />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Layout style={styles.container} level='1'>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        {isLoading ? <Layout style={styles.loading}>
          <ActivityIndicator size='large' color='#0097A7'/>
        </Layout> : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Layout style={styles.mainContainer}>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    defaultValue={name}
                    size='small'
                    placeholder="Teacher Full Name (Mandatory)"
                    status='primary'
                    accessoryLeft={personIcon}
                    autoCorrect={false}
                    onChangeText={text => setTeacherName(text)}
                    placement={placement}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    defaultValue={mobile}
                    size='small'
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
                    size='small'
                    disabled
                    editable={false}
                    defaultValue={login}
                    status='warning'
                    accessoryLeft={loginIcon}
                    placement={placement}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout style={styles.verticalSpace} />
                <Layout style={styles.parallel}>
                  <Layout style={styles.container}>
                    <CheckBox
                      style={styles.checkbox}
                      status='primary'
                      checked={checked}
                      onChange={nextChecked => setChecked(nextChecked)}>
                      Class Teacher
                    </CheckBox>
                  </Layout>
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout style={styles.parallel}>
                  <Layout style={styles.container}>
                    <Text style={styles.text} category='s1' status='info'>
                      Select Class:
                  </Text>
                    <Select
                      style={styles.select}
                      size='small'
                      disabled={checked ? false : true}
                      value={displayClassValue}
                      selectedIndex={selectedClassIndex}
                      onSelect={index => setSelectedClassIndex(index)}>
                      {classList.map(renderOption)}
                    </Select>
                  </Layout>
                  <Layout style={styles.container}>
                    <Text style={styles.text} category='s1' status='info'>
                      Select Section:
                  </Text>
                    <Select
                      style={styles.select}
                      size='small'
                      disabled={checked ? false : true}
                      value={displaySectionValue}
                      selectedIndex={selectedSectionIndex}
                      onSelect={index => setSelectedSectionIndex(index)}>
                      {sectionList.map(renderOption)}
                    </Select>
                  </Layout>
                </Layout>
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
  parallel: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mainContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  select: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
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

    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
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

export default UpdateTeacher;
