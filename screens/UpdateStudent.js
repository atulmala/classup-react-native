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

const UpdateStudent = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { id } = route.params;

  const [placement, setPlacement] = React.useState('bottom');
  const [isLoading, setLoading] = React.useState(false);

  const [firstName, setFirstName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [parent, setParent] = React.useState();
  const [mobile, setMobile] = React.useState();
  const [mobile2, setMobile2] = React.useState();

  const [classList] = useState([]);
  var selectedClass;
  const [selectedClassIndex, setSelectedClassIndex] = useState(new IndexPath(0));
  const displayClassValue = classList[selectedClassIndex.row];

  const [sectionList] = useState([]);
  var selectedSection;
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(new IndexPath(0));
  const displaySectionValue = sectionList[selectedSectionIndex.row];

  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  const getClassList = () => {
    return axios.get(serverIP.concat("/academics/class_list/", schoolID, "/"));
  };

  const getSectionList = () => {
    return axios.get(serverIP.concat("/academics/section_list/", schoolID, "/"));
  };

  const getStudentDetails = () => {
    return axios.get(serverIP.concat("/student/get_student_detail/", id, "/"));
  }

  useEffect(() => {
    axios.all([getClassList(), getSectionList(), getStudentDetails()]).then(
      axios.spread(function (classes, sections, details) {
        classList.push("Select");
        for (var i = 0; i < classes.data.length; i++) {
          classList.push(classes.data[i].standard);
        }
        console.log("classList = ", classList);

        sectionList.push("Select");
        for (i = 0; i < sections.data.length; i++) {
          sectionList.push(sections.data[i].section);
        }

        let lastName = details.data.last_name;
        setLastName(lastName);
        let firstName = details.data.first_name;
        setFirstName(firstName + " " + lastName);

        let parent = details.data.parent_name;
        setParent(parent);
        let mobile = details.data.parent_mobile1;
        setMobile(mobile);
        let mobile2 = details.data.parent_mobile2;
        setMobile2(mobile2);

        let theClass = details.data.class;
        let classIdx = classList.indexOf(theClass);
        setSelectedClassIndex(new IndexPath(classIdx));

        let section = details.data.section;
        let sectionIdx = sectionList.indexOf(section);
        setSelectedSectionIndex(new IndexPath(sectionIdx));

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
        <TouchableOpacity onPress={updateStudent}>
          <Image
            source={require('../assets/update_student.png')}
            style={{
              width: 30,
              height: 30,
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteStudent}>
          <Image
            source={require('../assets/delete_student.png')}
            style={{
              width: 30,
              height: 30,
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
        <Text style={styles.headerText}>Update Student</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerRight: () => <Upload />,
      headerStyle: {
        backgroundColor: '#ff8a65',
      },
    });
  });

  const updateStudent = () => {
    if (firstName == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: First Name not Entered',
        text2: "Please enter First Name",
      });
      return;
    }

    if (lastName == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Last Name not Entered',
        text2: "Please enter Last Name",
      });
      return;
    }

    if (parent == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Parent Name not Entered',
        text2: "Please enter Parent Name",
      });
      return;
    }

    if (mobile == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Mobile not Entered',
        text2: "Please enter Mobile",
      });
      return;
    }

    if (mobile.length != 10) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Invalid Mobile Number',
        text2: "Please enter a valid 10-digit Mobile Number",
      });
      return;
    }

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

    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Update this Student?",
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
            let url = serverIP.concat('/setup/update_student/');
            axios({
              method: "POST",
              url: url,
              data: {
                'user': userID,
                'school_id': schoolID,
                'student_id': id,
                'first_name': firstName,
                'last_name': lastName,
                'parent_name': parent,
                'mobile1': mobile, 
                'mobile2': mobile2,
                'the_class': selectedClass,
                'section': selectedSection,
                'roll_no': '50'
              }
            }).then(
              result => {
                const json = result.data;
                setLoading(false);
                console.log(json);
                let status = json.status;
                let message = json.message
                if (status == "success") {
                  Alert.alert(
                    "Student Updated", message,
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
                    "Student Update Failed. Please try again.", message,
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

  const deleteStudent = () => {
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Delete this Student?",
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
            let url = serverIP.concat('/setup/delete_student/');
            axios({
              method: "POST",
              url: url,
              data: {
                'student_id': id,
              }
            }).then(
              result => {
                const json = result.data;
                setLoading(false);
                console.log(json);
                let status = json.status;
                if (status == "success") {
                  Alert.alert(
                    "Student Deleted", "Student Deleted",
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
                    "Student Deletions Failed. ", "Student Deletion Failed. Please try again.",
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
          <ActivityIndicator size='large' />
        </Layout> : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Layout style={styles.mainContainer}>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    defaultValue={firstName}
                    size='small'
                    placeholder="First Name (Mandatory)"
                    status='primary'
                    accessoryLeft={personIcon}
                    autoCorrect={false}
                    onChangeText={text => setFirstName(text)}
                    placement={placement}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    defaultValue={parent}
                    size='small'
                    placeholder="Parent Name (Mandatory)"
                    status='success'
                    accessoryLeft={personIcon}
                    onChangeText={text => setParent(text)}
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
                    onChangeText={text => setMobile(text)}
                    placement={placement}
                    textStyle={{ textAlignVertical: 'top' }}
                  />
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

export default UpdateStudent;
