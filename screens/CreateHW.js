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
import DocumentPicker from 'react-native-document-picker';
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

const SelectClass = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [placement, setPlacement] = React.useState('bottom');

  const Upload = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={pickDocument}>
          <Image
            source={require('../assets/pdf.png')}
            style={{
              width: 30,
              height: 30,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadHW}>
          <Image
            source={require('../assets/upload3.png')}
            style={{
              width: 30,
              height: 30,
              borderRadius: 40 / 2,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Upload  />,
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
    });
  });

  const [classList] = useState([]);
  var selectedClass;
  const [selectedClassIndex, setSelectedClassIndex] = useState(new IndexPath(0));
  const displayClassValue = classList[selectedClassIndex.row];

  const [sectionList] = useState([]);
  var selectedSection;
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(new IndexPath(0),);
  const displaySectionValue = sectionList[selectedSectionIndex.row];

  const [subjectList] = useState([]);
  var selectedSubject;
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(new IndexPath(0));
  const displaySubjectValue = subjectList[selectedSubjectIndex.row];

  const [hwDescription, setHWDescription] = useState('');
  const [attachmentPresent, setAttachmentPresent] = useState(false);
  const [pdfName, setPdfName] = React.useState("None");
  const [uri, setUri] = useState("");

  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  const [isLoading, setLoading] = useState(true);

  // retrieve the list of classes, sections, and subjects for this school
  const getClassList = () => {
    return axios.get(serverIP.concat("/academics/class_list/", schoolID, "/"));
  };

  const getSectionList = () => {
    return axios.get(serverIP.concat("/academics/section_list/", schoolID, "/"));
  };

  const getSubjectList = () => {
    return axios.get(serverIP.concat("/teachers/teacher_subject_list/", userID, "/"));
  };

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setPlacement('top');
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setPlacement('bottom');
    });


    axios.all([getClassList(), getSectionList(), getSubjectList()]).then(
      axios.spread(function (classes, sections, subjects) {
        classList.push("Select");
        for (var i = 0; i < classes.data.length; i++) {
          classList.push(classes.data[i].standard);
        }

        sectionList.push("Select");
        for (i = 0; i < sections.data.length; i++) {
          sectionList.push(sections.data[i].section);
        }

        subjectList.push("Select");
        for (i = 0; i < subjects.data.length; i++) {
          subjectList.push(subjects.data[i].subject);
        }
        setLoading(false);
      })
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      setAttachmentPresent(true);
      setUri(res.uri);
      setPdfName(res.name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  const uploadHW = () => {
    if (selectedClassIndex.row === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Class Not Selected',
        text2: "Please Select a Class",
      });
      return;
    }
    else {
      selectedClass = classList[selectedClassIndex.row];
    }

    if (selectedSectionIndex.row === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Section Not Selected',
        text2: "Please Select a Section",
      });
      return;
    }
    else {
      selectedSection = sectionList[selectedSectionIndex.row];
    }

    if (selectedSubjectIndex.row === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Subject Not Selected',
        text2: "Please Select a Subject",
      });
      return;
    }
    else {
      selectedSubject = subjectList[selectedSubjectIndex.row];
    }

    if (hwDescription == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: HW Description not Entered',
        text2: "Please enter HW Description",
      });
      return;
    }

    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Upload this HW?",
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

            var d = new Date();
            var fileIncluded = "false"
            if (attachmentPresent) {
              fileIncluded = "true"
            }

            let formData = new FormData();

            formData.append("teacher", userID);
            formData.append("school_id", schoolID);
            formData.append("d", d.getDate());
            formData.append("m", d.getMonth() + 1);
            formData.append("y", d.getFullYear() + 1);
            formData.append("the_class", selectedClass);
            formData.append("section", selectedSection);
            formData.append("subject", selectedSubject);
            formData.append("all_sections", "No");
            formData.append("notes", hwDescription);
            formData.append("file_included", fileIncluded);
            if (attachmentPresent) {
              const split = uri.split('/');
              const name = split.pop();
              formData.append("file",
                {
                  uri: uri,
                  type: 'application/pdf',
                  name: name
                });
              formData.append("file_name", name);
            }
            try {
              axios.post(serverIP.concat("/homework/create_hw/"), formData)
                .then(function (response) {
                  console.log(response);
                  setLoading(false);
                  Alert.alert(
                    "HW Uploaded",
                    "Home Work Uploaded to Server.",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('HWListTeacher', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                            comingFrom: "CreateHW"
                          });
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                });
            } catch (error) {
              console.error(error);
            }
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
      <Layout style={styles.container} level='1'>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        {isLoading ? <Layout style={styles.loading}>
          <ActivityIndicator size='large' />
        </Layout> : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Layout style={styles.mainContainer}>
                <Layout style={styles.parallel}>
                  <Select
                    style={styles.select}
                    label={evaProps => <Text {...evaProps}>Select Class:</Text>}
                    value={displayClassValue}
                    selectedIndex={selectedClassIndex}
                    onSelect={index => setSelectedClassIndex(index)}>
                    {classList.map(renderOption)}
                  </Select>
                  <Select
                    style={styles.select}
                    label={evaProps => <Text {...evaProps}>Select Section:</Text>}
                    value={displaySectionValue}
                    selectedIndex={selectedSectionIndex}
                    onSelect={index => setSelectedSectionIndex(index)}>
                    {sectionList.map(renderOption)}
                  </Select>
                </Layout>
                <Layout style={styles.parallel}>
                  <Select
                    style={styles.select}
                    label={evaProps => <Text {...evaProps}>Select Subject:</Text>}
                    value={displaySubjectValue}
                    selectedIndex={selectedSubjectIndex}
                    onSelect={index => setSelectedSubjectIndex(index)}>
                    {subjectList.map(renderOption)}
                  </Select>
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout>
                  <Input
                    style={styles.hwDescription}
                    editable
                    placeholder="Enter Homework Description (Mandatory)"
                    multiline={true}
                    onChangeText={text => setHWDescription(text)}
                    placement={placement}
                    textStyle={{ minHeight: 64, textAlignVertical: 'top' }}
                  />
                </Layout>
                <Layout style={styles.verticalSpace} />
                <Layout style={styles.container}>
                  <Input
                    style={styles.hwDescription}
                    size='small'
                    width='90%'
                    disabled
                    placeholder={pdfName}
                    label={evaProps => <Text {...evaProps}>PDF Attahed:</Text>}
                  />
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
  evaProps: {
    textShadowColor: "magenta"
  },
  select: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  button: {
    margin: 2,
    backgroundColor: "cornflowerblue",
    width: "80%",
    height: "60%",
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  verticalSpace: {
    marginTop: 10
  },
  mainContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
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

export default SelectClass;
