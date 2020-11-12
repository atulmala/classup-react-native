import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator, Alert,
  TouchableOpacity, KeyboardAvoidingView, FlatList
} from 'react-native';

import { CheckBox, Input } from '@ui-kitten/components';
import { useHeaderHeight } from '@react-navigation/stack';

import axios from 'axios';

const MarksEntry = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { exam } = route.params;
  const { testID } = route.params;
  const { theClass } = route.params;
  const { subject } = route.params;
  const { type } = route.params;
  const { gradeBased } = route.params;
  const { higherClass } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [markList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/academics/get_test_marks_list/", testID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];
          let record = {};
          record.index = i;
          record.id = res.id;
          let rollNo = i + 1;
          let name = res.student;
          let fullName = rollNo + ". " + name;
          record.fullName = fullName;
          record.parent = res.parent;

          let marks_obtained = res.marks_obtained;
          if (marks_obtained == "-5000.00" || marks_obtained == "-5000.0" || marks_obtained == "-5000") {
            marks_obtained = "";
          }

          record.absent = false;
          if (marks_obtained == "-1000.00" || marks_obtained == "-1000.0" || marks_obtained == "-1000") {
            marks_obtained = "ABSENT";
            record.absent = true;
          }
          record.marks_obtained = marks_obtained;

          gradeBased ? record.marks_obtained = "N/A" : marks_obtained.toString();
          record.grade = res.grade;
          if (record.grade == "ABSENT") {
            record.absent = true;
          }

          let periodic_test_marks = res.periodic_test_marks.toString();
          if (periodic_test_marks == "-5000.00" || periodic_test_marks == "-5000.0" || periodic_test_marks == "-5000") {
            periodic_test_marks = "";
          }
          record.periodic_test_marks = periodic_test_marks;

          let multi_asses_marks = res.multi_asses_marks.toString();
          if (multi_asses_marks == "-5000.00" || multi_asses_marks == "-5000.0" || multi_asses_marks == "-5000") {
            multi_asses_marks = "";
          }
          record.multi_asses_marks = multi_asses_marks;

          let notebook_marks = res.notebook_marks.toString();
          if (notebook_marks == "-5000.00" || notebook_marks == "-5000.0" || notebook_marks == "-5000") {
            notebook_marks = "";
          }
          record.notebook_marks = notebook_marks;

          let sub_enrich_marks = res.sub_enrich_marks.toString();
          if (sub_enrich_marks == "-5000.00" || sub_enrich_marks == "-5000.0" || sub_enrich_marks == "-5000") {
            sub_enrich_marks = "";
          }
          record.sub_enrich_marks = sub_enrich_marks;

          if (higherClass && type == "term") {
            let prac_marks = res.prac_marks.toString();
            if (prac_marks == "-5000.00" || prac_marks == "-5000.0" || prac_marks == "-5000") {
              prac_marks = "";
            }
            record.prac_marks = higherClass ? prac_marks : "N/A";
          }

          markList.push(record);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

  }, [schoolID]);

  let saveMarks = () => {
    let params = {};
    for (let mark of markList) {
      let params1 = {};
      if (!gradeBased) {
        params1.marks = mark.marks_obtained;
        if (params1.marks === "") {
          params1.marks = -5000.00;
        }
        if (params1.marks == "ABSENT") {
          params1.marks = -1000.00;
        }

        params1.pa = mark.periodic_test_marks;
        if (params1.pa === "") {
          params1.pa = -5000.00;
        }

        params1.notebook = mark.notebook_marks;
        if (params1.notebook === "") {
          params1.notebook = -5000.00;
        }

        params1.multi_assess = mark.multi_asses_marks;
        if (params1.multi_assess === "") {
          params1.multi_assess = -5000.00;
        }

        params1.subject_enrich = mark.sub_enrich_marks;
        if (params1.subject_enrich === "") {
          params1.subject_enrich = -5000.00;
        }

        params1.prac_marks = mark.prac_marks;
        if (params1.prac_marks === "") {
          params1.prac_marks = -5000.00;
        }
        params[mark.id] = params1;
      }
      else {
        params[mark.id] = mark.grade;
      }
    }

    let url = serverIP.concat("/academics/save_marks/");
    axios.post(url, {
      params
    })
      .then(function (response) {
        if (response.data.status == "success") {

        }
      })
      .catch(function (error) {
        setLoading(false);
        console.log("error = ", error);
        Alert.alert(
          "Error Saving Marks",
          "An error occurred while saving marks. Please try again. If error persist pl contact ClassUp Support",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      });
  };

  let submitMarks = () => {
    let params = {};

    for (let mark of markList) {
      let params1 = {};
      if (!gradeBased) {
        params1.marks = mark.marks_obtained;
        if (params1.marks === "") {
          let message = "Please enter marks for " + mark.fullName + " or mark Absent";
          Alert.alert(
            "Incomplete Entries",
            message,
            [
              { text: "OK" }
            ],
            { cancelable: false }
          );
          return;
        }
        if (params1.marks == "ABSENT") {
          params1.marks = -1000.00;
        }

        params1.pa = mark.periodic_test_marks;
        if (params1.pa == "") {
          if (type == "term" && !higherClass) {
            let message = "Please enter PA marks for " + mark.fullName;
            Alert.alert(
              "Incomplete Entries",
              message,
              [
                { text: "OK" }
              ],
              { cancelable: false }
            );
            return;
          }
          else {
            params1.pa = -5000.0;
          }
        }

        params1.multi_assess = mark.multi_asses_marks;
        if (params1.multi_assess === "") {
          if (type == "term" && !higherClass) {
            let message = "Please enter Mutiple Assessment marks for " + mark.fullName;
            Alert.alert(
              "Incomplete Entries",
              message,
              [
                { text: "OK" }
              ],
              { cancelable: false }
            );
            return;
          }
          else {
            params1.multi_assess = -5000.0;
          }
        }

        params1.notebook = mark.notebook_marks;
        if (params1.notebook === "") {
          if (type == "term" && !higherClass) {
            let message = "Please enter Notebook marks for " + mark.fullName;
            Alert.alert(
              "Incomplete Entries",
              message,
              [
                { text: "OK" }
              ],
              { cancelable: false }
            );
            return;
          }
          else {
            params1.notebook = -5000.0;
          }
        }

        params1.subject_enrich = mark.sub_enrich_marks;
        if (params1.subject_enrich === "") {
          if (type == "term" && !higherClass) {
            let message = "Please enter Subject Enrichment marks for " + mark.fullName;
            Alert.alert(
              "Incomplete Entries",
              message,
              [
                { text: "OK" }
              ],
              { cancelable: false }
            );
            return;
          }
          else {
            params1.subject_enrich = -5000.0;
          }
        }

        params1.prac_marks = mark.prac_marks;
        if (params1.prac_marks === "") {
          if (type == "term" && higherClass) {
            let message = "Please enter Practical marks for " + mark.fullName;
            Alert.alert(
              "Incomplete Entries",
              message,
              [
                { text: "OK" }
              ],
              { cancelable: false }
            );
            return;
          }
        }
        params[mark.id] = params1;
      }
      else {
        params[mark.id] = mark.grade;
      }
    }
    setLoading(true);
    let url = serverIP.concat("/academics/submit_marks/", schoolID, "/");
    axios.post(url, {
      params
    })
      .then(function (response) {
        if (response.data.status == "success") {
          setLoading(false);
          Alert.alert(
            "Marks Submitted",
            "Marks Submitted and students notified via Notification/SMS",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "OK", onPress: () => {
                  navigation.navigate('TestList', {
                    serverIP: serverIP,
                    schoolID: schoolID,
                    userID: userID,
                    exam: exam
                  });
                }
              }
            ],
            { cancelable: false }
          );

        }
      })
      .catch(function (error) {
        setLoading(false);
        console.log("error = ", error);
        Alert.alert(
          "Error Submitting Marks",
          "An error occurred while saving marks. Please try again. If error persist pl contact ClassUp Support",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      });
  };

  const CustomRow = ({ title, index }) => {
    const [checked, setChecked] = useState(false);
    return (
      <View style={styles.containerRow}>
        <View style={styles.container_text}>
          <View style={styles.parallel}>
            <Text style={styles.title}>
              {title.fullName}
            </Text>
            <CheckBox
              style={styles.checkbox}
              status='primary'
              checked={markList[index].absent}
              onChange={(value) => {
                if (value) {
                  markList[index].absent = true;
                  if (!gradeBased) {
                    markList[index].marks_obtained = "ABSENT";
                  }
                  else {
                    markList[index].grade = "ABSENT";
                  }
                }
                else {
                  markList[index].absent = false;
                  if (!gradeBased) {
                    markList[index].marks_obtained = "";
                  }
                  else {
                    markList[index].grade = "";
                  }
                }
                setChecked(previousState => !previousState);
              }
              }
            >
              Absent
            </CheckBox>
          </View>
        </View>
        <View style={styles.parallel}>
          <Input
            style={styles.select}
            disabled={markList[index].absent || gradeBased}
            status='primary'
            size='small'
            keyboardType="number-pad"
            label={evaProps => <Text {...evaProps}>Marks</Text>}
            defaultValue={markList[index].marks_obtained.toString()}
            onChangeText={marks => {
              markList[index].marks_obtained = parseFloat(marks);
            }}
          />
          <Input style={styles.select}
            disabled={markList[index].absent || !gradeBased}
            status='warning'
            size='small'
            autoCapitalize='characters'
            placeholder={gradeBased ? '' : 'N/A'}
            label={evaProps => <Text {...evaProps}>Grade</Text>}
            defaultValue={markList[index].grade}
            onChangeText={grade => {
              markList[index].grade = grade.toString();
            }
            }>
          </Input>
          {test.type == "term" && higherClass &&
            <Input
              style={styles.select}
              status='info'
              size='small'
              defaultValue={markList[index].prac_marks}
              keyboardType="decimal-pad"
              label={evaProps => <Text {...evaProps}>Practical</Text>}
              onChangeText={marks => {
                markList[index].prac_marks = parseFloat(marks);
              }}
            />}
        </View>
        {test.type == "term" && !higherClass &&
          <View style={styles.parallel}>
            <Input
              style={styles.select}
              status='warning'
              size='small'
              keyboardType="decimal-pad"
              label={evaProps => <Text {...evaProps}>PA</Text>}
              defaultValue={markList[index].periodic_test_marks}
              onChangeText={marks => {
                markList[index].periodic_test_marks = parseFloat(marks);
              }}
            />
            <Input
              style={styles.select}
              status='danger'
              size='small'
              keyboardType="decimal-pad"
              label={evaProps => <Text {...evaProps}>Multi Ass</Text>}
              defaultValue={markList[index].multi_asses_marks}
              onChangeText={marks => {
                markList[index].multi_asses_marks = parseFloat(marks);
              }}
            />
            <Input
              style={styles.select}
              status='success'
              size='small'
              keyboardType="decimal-pad"
              label={evaProps => <Text {...evaProps}>Notebook</Text>}
              defaultValue={markList[index].notebook_marks}
              onChangeText={marks => {
                markList[index].notebook_marks = marks;
              }}
            />
            <Input
              style={styles.select}
              status='primary'
              size='small'
              keyboardType="decimal-pad"
              label={evaProps => <Text {...evaProps}>Sub Enrich</Text>}
              defaultValue={markList[index].sub_enrich_marks}
              onChangeText={marks => {
                markList[index].sub_enrich_marks = marks;
              }}
            />
          </View>}
      </View>)
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow
            title={item}
            index={item.index}
          />}
        />
      </View>
    )
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Marks Entry </Text>
        <Text style={styles.headerLine}>{exam.title} {theClass} {subject}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#3f51b5',
      },
      headerRight: () =>
        <View style={styles.parallel}>
          {isLoading && <ActivityIndicator size='large' color='#0097A7' />}
          {!isLoading &&
            <TouchableOpacity style={styles.nextButton} onPress={() => saveMarks()}>
              <Text style={styles.nextText}>  Save  </Text>
            </TouchableOpacity>}
          {!isLoading &&
            <TouchableOpacity style={styles.nextButton} onPress={() => submitMarks()}>
              <Text style={styles.nextText}>Submit</Text>
            </TouchableOpacity>}
        </View>
    });
  });

  return (<KeyboardAvoidingView
    behavior={Platform.OS == "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS == "android" ? useHeaderHeight() + 30 : useHeaderHeight()}
    style={styles.container} >
    <ScrollView style={styles.container}
    >
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7' />
      </View> : (
          <CustomListview
            itemList={markList}
          />)}
    </ScrollView>
  </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7987d2',
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 2,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  containerRow: {
    flex: 1,
    paddingLeft: 2,
    paddingTop: 4,
    paddingBottom: 4,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 1,
    marginBottom: 1,
    borderRadius: 5,
    backgroundColor: '#f0f4c3',
  },
  title: {
    flex: 2,
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 18,
      }
    }),
    fontWeight: 'bold',
    color: '#4053bf',
    fontFamily: 'Verdana'
  },
  checkbox: {
    flex: 1,
    marginLeft: 22,
    margin: 4,
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
  headerLine: {
    ...Platform.select({
      ios: {
        fontSize: 10,
      },
      android: {
        fontSize: 10,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
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
  evaProps: {
    textShadowColor: "magenta",
    color: 'blue'
  },
  select: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: 'lavenderblush',
    height: 25,
    margin: 5,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'indigo',
  }
});

export default MarksEntry;