import React, { useEffect, useState } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, Alert, Linking
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const HWSubmissions = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { hwId } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [submissionList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    let url = serverIP.concat("/homework/get_submission_status/", hwId, "/");
    axios
      .get(url)
      .then(function (response) {
        // handle success
        
        for (var i = 0; i < response.data.length; i++) {
          let submission = {};
          submission.student_id = response.data[i].student_id;
          submission.student = response.data[i].student;
          submission.submitted = response.data[i].submitted;
          submission.evaluated = response.data[i].evaluated;
          submissionList.push(submission);
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
            <Text style={styles.baseText}>{title.student}</Text>
          </View>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Class:
              <Text style={styles.innerText}> {title.the_class}-{title.section}</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => deleteHW(index)}>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/delete_icon.jpeg')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Subect:
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
          <TouchableOpacity style={styles.FacebookStyle} activeOpacity={0.8}>
            <Image
              source={require('../assets/lens.png')}
              style={styles.ImageIconStyle}
            />
            <View style={styles.SeparatorLine} />
            <Text style={styles.TextStyle}> View Submissions </Text>
          </TouchableOpacity>
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

  const createHW = () => {
    navigation.navigate('CreateHW', {
      serverIP: serverIP,
      schoolId: schoolId,
      userID: userID,
      userName: userName,
      comingFrom: "teacherMenu"
    });
  };

  const deleteHW = (index) => {
    console.log("index = ", index);
    console.log("hwList = ", hwList);
    if (index < 0) {
      Alert.alert(
        "Dummy Placeholder HW",
        "This is a dummy HW. Will be automatically deleted when you have created real HW!",
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
        "Please Confirm ",
        "Are You sure you want to Delete this HW?",
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

              try {
                axios.delete(serverIP.concat("/academics/delete_hw/", index, "/"))
                  .then(function (response) {
                    console.log(response);
                    setLoading(false);
                    Alert.alert(
                      "HW Deleted",
                      "Home Deleted.",
                      [
                        {
                          text: "OK", onPress: () => {
                            navigation.navigate('HWListTeacher', {
                              serverIP: serverIP,
                              schoolId: schoolId,
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
              var position = 0;
              for (var hw of hwList) {
                if (hw.id == index) {
                  hwList.splice(position, 1)
                  break
                }
                else {
                  position++;
                }
              }
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <BigPlus onPress={createHW} />,
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
    });
  });

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
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 25,
    backgroundColor: '#ffe4e1'
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',

    backgroundColor: 'azure',
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
  tinyLogo: {
    margin: 8,
    width: 24,
    height: 24,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'center',
  },
  attendanceSwitch: {
    ...Platform.select({
      ios: {
        flex: 0
      },
      android: {
        flex: 1
      }
    }),
    marginRight: 6,
    marginLeft: 6
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
  btn1: {
    backgroundColor: '#FFCDD2',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
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
  FacebookStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'cornflowerblue',
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 10,
    margin: 5,
  },
  TextStyle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 4,
    marginRight: 4,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  SeparatorLine: {
    backgroundColor: '#fff',
    width: 0,
    height: 40,
  }

});

export default HWSubmissions;