import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import { IndexPath, Datepicker, Layout, Text, Select, Input, Button, SelectItem, Icon } from '@ui-kitten/components';
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

const calendarIcon = (props) => (
  <Icon {...props} name='calendar' />
);

const attachmentIcon = (props) => (
  <Icon {...props} name='attach-outline' />
);

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const SelectClass = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const multilineInputState = useInputState();

  const [placement, setPlacement] = React.useState('bottom');

  React.useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setPlacement('top');
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setPlacement('bottom');
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  });

  const [date, setDate] = React.useState(new Date());

  const [classList] = useState([]);
  var selectedClass;
  const [selectedClassIndex, setSelectedClassIndex] = useState(new IndexPath(0));
  const displayClassValue = classList[selectedClassIndex.row];

  const [sectionList] = useState([]);
  var selectedSection;
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(new IndexPath(0));
  const displaySectionValue = sectionList[selectedSectionIndex.row];

  const [subjectList] = useState([]);
  var selectedSubject;
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(new IndexPath(0));
  const displaySubjectValue = subjectList[selectedSubjectIndex.row];

  const renderOption = (title) => (
    <SelectItem title={title} />
  );

  const [isLoading, setLoading] = useState(true);

  // retrieve the list of classes, sections, and subjects for this school
  const getClassList = () => {
    return axios.get(serverIP.concat("/academics/class_list/", schoolId, "/"));
  };

  const getSectionList = () => {
    return axios.get(serverIP.concat("/academics/section_list/", schoolId, "/"));
  };

  const getSubjectList = () => {
    return axios.get(serverIP.concat("/teachers/teacher_subject_list/", userID, "/"));
  };

  useEffect(() => {
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
  }, []);

  const pickDocument = () =>  {
    try {
      const res =  DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

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

    const splitDate = date.toLocaleDateString().split("/");
    const selectedDay = splitDate[1];
    const selectedMonth = splitDate[0];
    const selectedYear = splitDate[2];

    navigation.navigate('TakeAttendance', {
      serverIP: serverIP,
      schoolId: schoolId,
      userID: userID,
      userName: userName,
      selectedDay: selectedDay,
      selectedMonth: selectedMonth,
      selectedYear: selectedYear,
      selectedClass: selectedClass,
      selectedSection: selectedSection,
      selectedSubject: selectedSubject,
      comingFrom: "SelectClass"
    });
  };

  return (
    <Layout style={styles.container} level='1'>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <Layout style={styles.loading}>
        <ActivityIndicator size='large' />
      </Layout> : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContentContainer}>
            <Layout
              style={styles.container}
              contentContainerStyle={styles.scrollContentContainer}>
              <Text style={styles.text} category='s1' status='info'>
                Select Due date:
              </Text>
              <Datepicker
                style={styles.select}
                accessoryRight={calendarIcon}
                date={date}
                onSelect={nextDate => setDate(nextDate)}
              />
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
              <Text style={styles.text} category='s1' status='info'>
                Select Subject:
              </Text>
              <Select
                style={styles.select}
                value={displaySubjectValue}
                selectedIndex={selectedSubjectIndex}
                onSelect={index => setSelectedSubjectIndex(index)}>
                {subjectList.map(renderOption)}
              </Select>
              <Layout style={styles.verticalSpace} />
              <Input
                style={styles.hwDescription}
                multiline={true}
                placement={placement}
                textStyle={{ minHeight: 64 }}
                placeholder='Enter Home Work Description (Mandatory)'
                {...multilineInputState}
              />
              <Layout style={styles.buttonContainer}>
                <Button style={styles.button} appearance='outline' status='info' accessoryLeft={attachmentIcon} onPress={pickDocument}>
                  {"Insert PDF Attachment (Optonal)"}
                </Button>
              </Layout>
            </Layout>
          </ScrollView >
          </TouchableWithoutFeedback>
        )}
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
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
    width: "80%"
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100
  },
  verticalSpace: {
    marginTop: 20
  },
  scrollContentContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  parallel: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: "100%"
  },
  hwDescription:  {
    marginLeft: 5,
    marginRight: 5
  },
  text: {
    margin: 2,
    fontSize: 18,
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
