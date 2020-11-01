import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet, ScrollLayout, ActivityIndicator, Keyboard, KeyboardAvoidingLayout, Image, Alert,
  Platform, TouchableOpacity, TouchableWithoutFeedback, Text, View
} from 'react-native';
import {
  IndexPath, Select, Input, Button, SelectItem, Icon, Layout
} from '@ui-kitten/components';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const CreateLecture = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const Upload = () => {
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
        <TouchableOpacity onPress={uploadLecture}>
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

  const HeaderTitle = () => {
    return (
      <Text style={styles.headerText}>Create Lecture</Text>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerRight: () => <Upload />,
      headerStyle: {
        backgroundColor: 'darkolivegreen',
      },
    });
  });

  const [classList] = useState([]);
  var selectedClass;
  const [selectedClassIndex, setSelectedClassIndex] = useState(new IndexPath(0));
  const displayClassValue = classList[selectedClassIndex.row];

  const [subjectList] = useState([]);
  var selectedSubject;
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(new IndexPath(0));
  const displaySubjectValue = subjectList[selectedSubjectIndex.row];

  const [lectureDescription, setLectureDescription] = useState('');
  const [attachmentPresent, setAttachmentPresent] = useState(false);
  const [videoLink, setVideoLink] = React.useState("None");
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

  const getSubjectList = () => {
    return axios.get(serverIP.concat("/teachers/teacher_subject_list/", userID, "/"));
  };

  useEffect(() => {
    axios.all([getClassList(), getSubjectList()]).then(
      axios.spread(function (classes, subjects) {
        classList.push("Select");
        for (var i = 0; i < classes.data.length; i++) {
          classList.push(classes.data[i].standard);
        }

        subjectList.push("Select");
        for (i = 0; i < subjects.data.length; i++) {
          subjectList.push(subjects.data[i].subject);
        }
        setLoading(false);
      })
    );
  }, []);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

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

  const uploadLecture = () => {
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

    if (lectureDescription == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Lecture Description not Entered',
        text2: "Please enter Lecture Description",
      });
      return;
    }

    if (pdfName == "None" && videoLink == "None") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Neither Video nor Doc present',
        text2: "Attach at least Video Link or Document or both",
      });
      return;
    }

    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Create this Lecture ?",
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
                <Layout>
                  <ActivityIndicator style={styles.loading} size='large' />
                </Layout>
              )
            }

            var fileIncluded = "false"
            if (attachmentPresent) {
              fileIncluded = "true"
            }

            let formData = new FormData();

            formData.append("teacher", userID);
            formData.append("school_id", schoolID);
            formData.append("the_class", selectedClass);
            formData.append("section", "all_sections");
            formData.append("subject", selectedSubject);
            formData.append("all_sections", "true");
            formData.append("lesson_topic", lectureDescription);
            formData.append("youtube_link", videoLink);
            formData.append("file_included", fileIncluded);
            if (attachmentPresent) {
              const split = uri.split('/');
              let name = split.pop()
              name = name.replace(/ /g,"_");

              formData.append("file",
                {
                  uri: uri,
                  type: 'application/pdf',
                  name: name
                });
              formData.append("file_name", name);
            }
            try {
              axios.post(serverIP.concat("/lectures/share_lecture/"), formData)
                .then(function (response) {
                  console.log(response);
                  setLoading(false);
                  Alert.alert(
                    "Lecture Uploaded",
                    "Lecture Uploaded to Server.",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('LectureListTeacher', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                            comingFrom: "CreateLecture"
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
    <Layout style={styles.container} level='1'>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <Layout style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
      </Layout> : (
          <Layout style={styles.mainContainer}>
            <Layout style={styles.parallel}>
              <Select
                style={styles.select1}
                label={evaProps => <Text {...evaProps}>Select Class:</Text>}
                value={displayClassValue}
                selectedIndex={selectedClassIndex}
                onSelect={index => setSelectedClassIndex(index)}>
                {classList.map(renderOption)}
              </Select>
              <Select
                style={styles.select2}
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
                style={styles.lectureDescription}
                size='small'
                editable
                placeholder='Enter Lecture Description (Mandatory)'
                onChangeText={text => setLectureDescription(text)}
                textStyle={{ textAlignVertical: 'top' }}
              />
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.verticalSpace} />
              <Input
                style={styles.lectureDescription}
                editable
                size='small'
                placeholder='Lecture Video Link'
                onChangeText={text => setVideoLink(text)}
                textStyle={{ textAlignVertical: 'top' }}
              />
            </Layout>
            <Layout style={styles.verticalSpace} />
            <Layout style={styles.container}>
              <Input
                style={styles.lectureDescription}
                size='small'
                width='90%'
                disabled
                placeholder={pdfName}
                label={evaProps => <Text {...evaProps}>PDF Attahed:</Text>}
              />
            </Layout>
          </Layout>
        )}
    </Layout>
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
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 18,
      },
      android: {
        fontSize: 18,
      }
    }),
    marginTop: 0,
    fontWeight: 'bold',
    color: 'white',
  },
  select1: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  select2: {
    flex: 2,
    margin: 5,
    borderRadius: 5,
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
  lectureDescription: {
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

export default CreateLecture;
