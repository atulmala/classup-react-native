import _ from 'lodash';
import React from 'react';
import { useState } from 'react';
import {
  StyleSheet, ActivityIndicator, Image, Alert,
  Platform, TouchableOpacity, TouchableWithoutFeedback, Text, View
} from 'react-native';
import { Input, Button, Icon, Layout } from '@ui-kitten/components';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import Toast from 'react-native-toast-message';

var RNFS = require('react-native-fs');

const ComposeMessageTeacher = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { groupID } = route.params;
  const { groupName } = route.params;

  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = React.useState("");
  const [pdfName, setPdfName] = React.useState("None");
  const [uri, setUri] = React.useState("");
  const [attachmentPresent, setAttachmentPresent] = useState(false);
  const [attachmentType, setAttachmentType] = useState("unknown");

  const Upload = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={pickDocument}>
          <Image
            source={require('../assets/attachmemt.png')}
            style={{
              width: 30,
              height: 30,
              marginTop: 3,
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage}>
          <Image
            source={require('../assets/send_message.png')}
            style={{
              width: 40,
              height: 40,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (res.uri.startsWith('content://')) {
        const fileNameAndExtension = res.name;
        const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
        await RNFS.copyFile(res.uri, destPath);
        setUri("file://".concat(destPath));
      }
      else {
        console.log("source does not start with content://")
      }
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      setUri(res.uri);
      setAttachmentPresent(true);
      // setUri(res.uri);
      setAttachmentType(res.type);
      setPdfName(res.name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  const previewAttachment = () => {
    let images = []
    let props = {};
    let require = "require";
    props.url = uri;
    props.source = require.concat("(", uri, ")");
    images.push(props);

    navigation.navigate('PreviewAttachment', {
      type: attachmentType,
      images: images,
      source: {
        'uri': uri
      },
      pdfName: pdfName,
    });
  }

  const HeaderTitle = () => {
    return (
      <View>
        <Text style={styles.headerText}>Compose Message</Text>
        <Text style={styles.headerText2}>Group: {groupName}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerRight: () => <Upload />,
      headerStyle: {
        backgroundColor: 'forestgreen',
      },
    });
  });

  const sendMessage = () => {
    if (message.length == 0) {
      alert("Message is empty");
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Empty Message',
        text2: "Please enter message",
      });
      return;
    }

    if (message.length > 400) {
      alert("Max character limit 400 exceeded");
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Very long message',
        text2: "Please limit the message to 400 characters",
      });
      return;
    }

    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Send this message ?",
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

            formData.append("coming_from", "ActivityGroup");
            formData.append("teacher", userID);
            formData.append("message", message);
            formData.append("school_id", schoolID);
            formData.append("group_id", groupID);
            
            formData.append("image_included", fileIncluded);
            if (attachmentPresent) {
              const split = uri.split('/');
              let name = split.pop()
              name = name.replace(/ /g, "_");
              console.log("name = ", pdfName);

              formData.append("file",
                {
                  uri: uri,
                  type: 'application/pdf',
                  name: pdfName
                });
              formData.append("image_name", pdfName);
            }
            console.log("formData = ", formData);
            try {
              axios.post(serverIP.concat("/operations/send_message/", schoolID, "/"), formData)
                .then(function (response) {
                  console.log(response);
                  setLoading(false);
                  Alert.alert(
                    "Messages Sent",
                    "Messages Sent and will be delivered in about an hour time!.",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('TeacherMenu', {
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
                }).catch(error => {
                  console.log("ran into error");
                  setLoading(false);
                  console.log(error);
                  Alert.alert(
                    "Messages Sent",
                    "Messages Sent and will be delivered in about an hour time!.",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('TeacherMenu', {
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
                });
            } catch (error) {
              console.log("ran into error");
              setLoading(false);
              console.error(error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const PreviewIcon = (props) => {
    return (
      <Icon {...props} name='eye-outline'></Icon>
    );
  };
  const DeleteIcon = (props) => {
    return (
      <Icon {...props} name='trash-2-outline'></Icon>
    );
  };

  return (
    <Layout style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <Layout style={styles.container} level='6'>
            <Layout style={styles.mainContainer}>
              <Layout style={styles.verticalSpace} />
              <Layout>
                <Input
                  style={styles.lectureDescription}
                  size='large'
                  editable
                  multiline
                  placeholder='Enter Message (Mandatory) - Max 400 characters'
                  onChangeText={text => setMessage(text)}
                  textStyle={{ minHeight: 80, textAlignVertical: 'top' }}
                />
                <Layout style={styles.verticalSpace} />
              </Layout>
              <Layout style={styles.verticalSpace} />
              <Layout >
                <Input
                  style={styles.lectureDescription}
                  size='small'
                  width='90%'
                  disabled
                  placeholder={pdfName}
                  label={evaProps => <Text {...evaProps}>Attachment:</Text>}
                />
                <Layout style={styles.verticalSpace} />
                <Layout style={styles.parallel}>
                  <Layout style={styles.buttonContainer}>
                    <Button
                      style={styles.button}
                      appearance='outline'
                      size='tiny'
                      status='info'
                      accessoryLeft={PreviewIcon}
                      onPress={previewAttachment}>
                      {"Preview Attachment"}
                    </Button>
                  </Layout>
                  <Layout style={styles.buttonContainer}>
                    <Button
                      style={styles.button}
                      appearance='outline'
                      size='tiny'
                      status='danger'
                      accessoryLeft={DeleteIcon}
                      onPress={sendMessage}>
                      {"Remove Attachment"}
                    </Button>
                  </Layout>
                </Layout>
              </Layout>
            </Layout>
          </Layout>)}
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    width: "100%",
    padding: 5
  },
  evaProps: {
    textShadowColor: "magenta"
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 100
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
    marginTop: 0,
    fontWeight: 'bold',
    color: 'white',
  },
  headerText2: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 14,
      }
    }),
    marginTop: 0,
    fontWeight: 'bold',
    color: 'white',
  },
  verticalSpace: {
    marginTop: 5
  },
  lectureDescription: {
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'top',
    minHeight: 64,
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
  },
});

export default ComposeMessageTeacher;
