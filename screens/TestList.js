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
          let yyyymmdd = res.date_conducted.split("-");
          let ddmmyyyy = yyyymmdd[2] + "-" + yyyymmdd[1] + "-" + yyyymmdd[0];
          test.date = ddmmyyyy;
          test.subject = res.subject;
          test.theClass = res.the_class;
          test.class = res.the_class + "-" + res.section;
          test.maxMarks = res.max_marks;
          test.passingMarks = res.passing_marks;
          test.gradeBased = res.grade_based ? "Grade Based" : "Marks Based";
          test.status = "Pending";
          test.type = res.test_type;
          testList.push(test);
        }

        for (var j = 0; j < completed.data.length; j++) {
          let test = {};
          let res = completed.data[j];
          test.id = res.id;
          let yyyymmdd = res.date_conducted.split("-");
          let ddmmyyyy = yyyymmdd[2] + "-" + yyyymmdd[1] + "-" + yyyymmdd[0];
          test.date = ddmmyyyy;
          test.subject = res.subject;
          test.theClass = res.the_class;
          test.class = res.the_class + "-" + res.section;
          test.maxMarks = res.max_marks;
          test.passingMarks = res.passing_marks;
          test.gradeBased = res.grade_based  ? "Grade Based" : "Marks Based";
          test.status = "Completed";
          test.type = res.test_type;
          testList.push(test);
        }
        setLoading(false);
      })
    );
  }, [schoolID]);

  const BigPlus = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={scheduleTest}>
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
          <View style={styles.container_text1}>
            <Text style={styles.baseText}>
              Date:
              <Text style={styles.innerText}> {title.date}</Text>
            </Text>
          </View>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Class:
              <Text style={styles.innerText}> {title.class}</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => marksEntry(index)}>
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
              Type:
              {title.gradeBased == "Marks Based" && 
              <Text style={styles.marksBased}> {title.gradeBased}</Text>}
              {title.gradeBased == "Grade Based" && 
              <Text style={styles.gradeBased}> {title.gradeBased}</Text>}
            </Text>
          </View>

        </View>
        <View style={styles.containerRow}>
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

  const scheduleTest = () => {
    navigation.navigate('ScheduleTest', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      exam: exam,
      comingFrom: "teacherMenu"
    });
  };

  const marksEntry = (index) =>   {
    var higherClass = false;
    for (test of testList)  {
      if (test.id == index) {
        let theClass = test.class;
        let subject = test.subject;
        let type = test.type;
        let gradeBased = test.gradeBased == "Grade Based" ? true : false;
        if (test.theClass == 'XI' || test.theClass == 'XII')  {
          higherClass = true;
        }
        navigation.navigate('MarksEntry', {
          serverIP: serverIP,
          schoolID: schoolID,
          userID: userID,
          userName: userName,
          exam: exam,
          testID: index,
          theClass: theClass,
          subject: subject,
          type: type,
          gradeBased: gradeBased,
          higherClass: higherClass
        });
        break;
      }
    }
    
  }

  const deleteTest = (index) => {
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Delete this Test? If you have entered any marks those will also be deleted!",
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
              axios.delete(serverIP.concat("/academics/delete_test/", index, "/"))
                .then(function (response) {
                  setLoading(false);
                  Alert.alert(
                    "Test Deleted",
                    "Test Deleted.",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.replace('TestList', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                            exam: exam,
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
      headerRight: () => <BigPlus onPress={scheduleTest} />,
      headerStyle: {
        backgroundColor: 'mediumslateblue',
      },
    });
  });

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
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
    backgroundColor: 'honeydew',
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
    backgroundColor: 'honeydew',
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
  container_text1: {
    flex: 5,
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'center',
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 18,
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
  marksBased: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'saddlebrown',
    margin: 4
  },
  gradeBased: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'cornflowerblue',
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
});

export default TestList;