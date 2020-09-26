import React, { useEffect, useState } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, Alert, Linking
} from 'react-native';
import { Button, Icon, Layout, Spinner } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const HWListStudent = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { subject } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [hwList] = useState([]);
  const isFocused = useIsFocused();

  const checkIcon = (props) => (
    <Icon {...props} name='checkmark-circle-outline' />
  );

  const uploadIcon = (props) => (
    <Icon {...props} name='cloud-upload-outline' />
  );

  useEffect(() => {
    let url = serverIP.concat("/academics/retrieve_hw/", studentID, "/");
    axios
      .get(url, {
        params: {
          subject: subject,
        }
      })
      .then(function (response) {
        // handle success
        if (response.data.length == 0) {

        }
        else {
          hwList.length = 0;
          for (var i = 0; i < response.data.length; i++) {
            console.log("hw with this id is fresh entry hence will be added");
            let hw = {};
            hw.id = response.data[i].id;
            let long_date = response.data[i].due_date;
            let yyyymmdd = long_date.slice(0, 10);
            hw.the_class = response.data[i].the_class;
            hw.section = response.data[i].section;
            hw.subject = response.data[i].subject;

            hw.date = yyyymmdd;

            hw.description = response.data[i].notes;
            hw.location = response.data[i].location;

            hwList.push(hw);
          }
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });
  }, [isFocused]);


  const CustomRow = ({ title, index }) => {
    return (
      <View style={styles.containerLine}>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Date:
              <Text style={styles.innerText}> {title.date}</Text>
            </Text>
          </View>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Class:
              <Text style={styles.innerText}> {title.the_class}-{title.section}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Subject:
              <Text style={styles.innerText}> {title.subject}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Description:
              <Text style={styles.innerTextDescription}> {title.description}</Text>
            </Text>
          </View>
        </View>
        {title.location != null &&
          <View style={styles.containerRow}>
            <View style={styles.container_text}>
              <Text style={styles.baseText} onPress={() => openURL(title)}>
                Attachment:
              <Text style={styles.hyperlink}>Tap here to view</Text>
              </Text>
            </View>
          </View>}
        <View style={styles.containerRow}>
          <Button
            style={styles.button}
            appearance='outline'
            status='primary'
            accessoryLeft={uploadIcon}
            onPress={() => showInstructions(index)}
          >
            Submit HW
          </Button>

          <Button style={styles.button} appearance='outline' status='success' accessoryLeft={checkIcon}>
            See Check HW
          </Button>
        </View>
      </View>
    )
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow title={item} index={item.id} />}
        />
      </View>
    )
  };

  const openURL = (title) => {
    Linking.openURL(title.location)
  }

  const showInstructions = (index) => {
    let hwID = index;
    let url = serverIP.concat("/homework/whether_submitted/", hwID, "/", studentID, "/");
    axios
      .get(url)
      .then(function (response) {
        const message = response.data.message
        if (response.data.submission_status == "submitted") {
          if (response.data.evaluation_status == "evaluated") {
            Alert.alert(
              "Already Evaluated ",
              message,
              [
                {
                  text: "Cancel",
                  onPress: () => { return },
                  style: "cancel"
                }
              ]
            );
          }
          else {
            Alert.alert(
              "Already Submitted ",
              message,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "OK", onPress: () => {
                    let url = serverIP.concat("/homework/delete_submission/", hwID, "/", studentID, "/");
                    axios
                      .delete(url)
                      .then(function (response) {
                        navigation.navigate('HWInstructions', {
                          serverIP: serverIP,
                          userID: userID,
                          studentID: studentID,
                          subject: subject,
                          hwID: index,
                        });
                      })
                      .catch(function (error) {
                        // handle error
                        console.log(error);
                        self.waiting = false;
                      });
                  }
                }
              ],
              { cancelable: false }
            );
          }
        }
        else {
          navigation.navigate('HWInstructions', {
            serverIP: serverIP,
            userID: userID,
            studentID: studentID,
            hwID: index,
          });
        }

      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });
  }

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <CustomListview
            itemList={hwList}
          />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 6
  },
  containerLine: {
    flex: 1,
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 10,
    backgroundColor: 'azure',
    elevation: 6,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'center',
  },

  baseText: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),

    fontWeight: 'bold',
    color: '#708090',
    margin: 4
  },
  innerText: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: '#4b0082',
    margin: 4
  },
  innerTextDescription: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'indigo',
    margin: 4
  },
  hyperlink: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'dodgerblue',
    margin: 4
  },
  button: {
    margin: 8,
    height: '40%',
    width: '45%',
    fontSize: 10
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

  TextStyle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 4,
    marginRight: 4,
  },

  SeparatorLine: {
    backgroundColor: '#fff',
    width: 0,
    height: 40,
  }

});

export default HWListStudent;