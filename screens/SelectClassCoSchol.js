import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { IndexPath, Layout, Text, Select, Button, SelectItem, Radio, RadioGroup } from '@ui-kitten/components';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const SelectClassCoSchol = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [classList] = useState([]);
  var selectedClass;
  const [selectedClassIndex, setSelectedClassIndex] = useState(new IndexPath(0));
  const displayClassValue = classList[selectedClassIndex.row];

  const [sectionList] = useState([]);
  var selectedSection;
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(new IndexPath(0));
  const displaySectionValue = sectionList[selectedSectionIndex.row];

  const [selectedTermIndex, setSelectedTermIndex] = React.useState(-1);
  let term = "term1";

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

  useEffect(() => {
    axios.all([getClassList(), getSectionList()]).then(
      axios.spread(function (classes, sections) {
        classList.push("Select");
        for (var i = 0; i < classes.data.length; i++) {
          classList.push(classes.data[i].standard);
        }

        sectionList.push("Select");
        for (i = 0; i < sections.data.length; i++) {
          sectionList.push(sections.data[i].section);
        }
        setLoading(false);
      })
    );
  }, []);


  const takeAttendance = () => {
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

    switch (selectedTermIndex) {
      case -1:
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error: Term Not Selected',
          text2: "Please Select a Term",
        });
        return;
      case 0:
        term = "term1";
        break;
      case 1:
        term = "term2";
        break;
    }

    let url = serverIP.concat("/teachers/whether_class_teacher2/", userID, "/");
    axios({
      method: "GET",
      url: url,

    }).then(
      result => {
        const json = result.data;
        if (json.is_class_teacher == "true") {
          if (json.the_class == selectedClass && json.section == selectedSection) {
            navigation.navigate('CoScholastic', {
              serverIP: serverIP,
              schoolID: schoolID,
              userID: userID,
              userName: userName,
              selectedClass: selectedClass,
              selectedSection: selectedSection,
              term: term
            });
          }
          else {
            Alert.alert(
              "Not the Class Teacher!",
              "You are not the Class Teacher of " + selectedClass + "-" + selectedSection,
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          }

        }
        else {
          Alert.alert(
            "Not the Class Teacher!",
            "You are not the Class Teacher of " + selectedClass + "-" + selectedSection,
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        }
      });
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText} status='warning' >Select Class, Section & Term</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'darkgoldenrod',
      },
    });
  });

  return (
    <Layout style={styles.container} level='1'>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <Layout style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7' />
      </Layout> : (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}>
            <Layout
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContentContainer}>
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.parallel}>
                <Layout style={styles.container}>
                  <Text style={styles.text} category='s1' status='info'>
                    Select Class:
                  </Text>
                  <Select
                    style={styles.select}
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
                    value={displaySectionValue}
                    selectedIndex={selectedSectionIndex}
                    onSelect={index => setSelectedSectionIndex(index)}>
                    {sectionList.map(renderOption)}
                  </Select>
                </Layout>
              </Layout>
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.container}>
                <Text style={styles.text} category='s1' status='info'>
                  Select Term:
                  </Text>
                <RadioGroup
                  selectedIndex={selectedTermIndex}
                  onChange={index => setSelectedTermIndex(index)}>
                  <Radio>Term 1</Radio>
                  <Radio>Term 2</Radio>
                </RadioGroup>
              </Layout>
              <Layout style={styles.verticalSpace} />
              <Layout style={styles.buttonContainer}>
                <Button style={styles.button} appearance='outline' status='info' onPress={takeAttendance}>
                  {"Enter Grades"}
                </Button>
              </Layout>
            </Layout>
          </ScrollView >
        )}
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  select: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center"
  },
  button: {
    margin: 2,
    width: "60%"
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100
  },
  verticalSpace: {
    marginTop: 15
  },
  scrollContentContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },
  parallel: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: "100%"
  },
  text: {
    margin: 2,
    fontSize: 14,
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

export default SelectClassCoSchol;
