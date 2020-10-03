import React, { useEffect, useState } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, Alert
} from 'react-native';
import axios from 'axios';

const TestList = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { exam } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [testList] = useState([]);

  // retrieve the list of pending and completed test list for this teacher
  const getPendingTestList = () => {
    return axios.get(serverIP.concat("/academics/pending_test_list/", userID, "/", exam.id, "/"));
  };

  const getCompletedTestList = () => {
    return axios.get(serverIP.concat("/academics/completed_test_list/", userID, "/", exam.id, "/"));
  };

  useEffect(() => {
    axios.all([getPendingTestList(), getCompletedTestList()]).then(
      axios.spread(function (pending, completed) {
        for (var i = 0; i < pending.data.length; i++) {
          let test = {};
          let res = pending.data[i];
          test.id = res.id;
          test.date = res.date_conducted;
          test.subject = res.subject;
          test.class = res.the_class + "-" + res.section;
          test.maxMarks = res.max_marks;
          test.passingMarks = res.passing_marks;
          test.gradeBased = res.grade_based == "true" ? "Grade Based" : "Marks Based";
          test.status = "Pending";
          test.type = res.test_type;
          testList.push(test);
        }

        for (var j = 0; j < completed.data.length; j++) {
          let test = {};
          let res = completed.data[j];
          test.id = res.id;
          test.date = res.date_conducted;
          test.subject = res.subject;
          test.class = res.the_class + "-" + res.section;
          test.maxMarks = res.max_marks;
          test.passingMarks = res.passing_marks;
          test.gradeBased = res.grade_based == "true" ? "Grade Based" : "Marks Based";
          test.status = "Completed";
          test.type = res.test_type;
          testList.push(test);
        }
        setLoading(false);
      })
    );
  }, [schoolID]);

  const BigPlus = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={require('../assets/big_plus.png')}
            style={{
              width: 25,
              height: 25,
              borderRadius: 40 / 2,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

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
          <TouchableOpacity onPress={() => deleteTest(index)}>
            <Image
              style={styles.tinyLogo}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTest(index)}>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/pen.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTest(index)}>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/delete_icon.jpeg')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.containerRow}>

          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Subject:
              <Text style={styles.innerText}> {title.subject}</Text>
            </Text>
          </View>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Class:
              <Text style={styles.innerText}> {title.class}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Type:
              <Text style={styles.innerTextDescription}> {title.gradeBased}</Text>
            </Text>
          </View>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Status:
              {title.status == "Pending" &&
                <Text style={styles.pending}> {title.status}</Text>}
              {title.status == "Completed" &&
                <Text style={styles.completed}> {title.status}</Text>}
            </Text>
          </View>
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

  const createTest = () => {
    navigation.navigate('CreateHW', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      comingFrom: "teacherMenu"
    });
  };

  const showSubmissins = (index) => {
    console.log("index = ", index);
    navigation.navigate('HWSubmissions', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      hwID: index,
      comingFrom: "hwListTeacher"
    });
  };

  const deleteTest = (index) => {
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
  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText} status='warning' category='h6'>Test List for {exam.title}</Text>
      </View>
    );
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'center',
      headerRight: () => <BigPlus onPress={createTest} />,
      headerStyle: {
        backgroundColor: 'mediumslateblue',
      },
    });
  });

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <CustomListview
            itemList={testList}
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
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 18,
      },
      android: {
        fontSize: 20,
      }
    }),

    fontWeight: 'bold',
    color: 'white',
    margin: 4
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
  pending: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'orangered',
    margin: 4
  },
  completed: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'limegreen',
    margin: 4
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
});

export default TestList;