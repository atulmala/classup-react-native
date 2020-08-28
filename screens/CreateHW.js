import _ from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet, Platform, ScrollView, Text, TextInput, KeyboardAvoidingView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';

import axios from 'axios';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import dropdown from '../assets/chevronDown.png';
const plusIcon = require('../assets/attachmemt.jpg');
import InputScrollView from 'react-native-input-scroll-view';



dialogHeader = props => {
  const { title } = props;
  return (
    <Text margin-15 text60>
      {title}
    </Text>
  );
};

renderDialog = modalProps => {
  const { visible, toggleModal, children, } = modalProps;

  return (
    <Dialog
      migrate
      visible={visible}
      onDismiss={() => toggleModal(false)}
      width="90%"
      borderRadius="10"
      height="45%"
      bottom
      useSafeArea
      containerStyle={{ backgroundColor: "oldlace" }}
      renderPannableHeader={dialogHeader}
      panDirection={PanningProvider.Directions.DOWN}
      pannableHeaderProps={{ title: '' }}
    >
      <ScrollView>{children}</ScrollView>
    </Dialog>
  );
};

const CreateHW = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [classList] = useState([]);
  const [selectedClass, setSelectedClass] = useState();
  const [sectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState();
  const [subjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState();

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
        for (var i = 0; i < classes.data.length; i++) {
          let aClass = {};
          aClass.label = classes.data[i].standard;
          aClass.value = classes.data[i].standard;
          classList.push(aClass);
        }
        for (i = 0; i < sections.data.length; i++) {
          let aSection = {};
          aSection.label = sections.data[i].section;
          aSection.value = sections.data[i].section;
          sectionList.push(aSection);
        }
        for (i = 0; i < subjects.data.length; i++) {
          let aSubject = {};
          aSubject.label = subjects.data[i].subject;
          aSubject.value = subjects.data[i].subject;
          if (subjects.data[i].subject === "Main") {
            console.log("subject", subjects.data[i].subject);
            aSubject.selected = true;
          }
          subjectList.push(aSubject);
        }
        setLoading(false);
      })
    );
  }, []);

  defaultSubject = {
    defaultSubject: ['Main']
  };

  const [value, onChangeText] = useState('');

  const showTakeAttendance = () => {
    if (selectedClass == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Class Not Selected',
        text2: "Please Select a Class",
      });
      return;
    }

    if (selectedSection == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Section Not Selected',
        text2: "Please Select a Section",
      });
      return;
    }

    if (selectedSubject == "") {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error: Subject Not Selected',
        text2: "Please Select a Subject",
      });
      return;
    }

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <TouchableOpacity onPress={() => showTakeAttendance()}>
          <Icon name="arrow-circle-right" size={30} padding={10} color="black" />
        </TouchableOpacity>
    });
  });

  var myScrollView;

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    
    >
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <ScrollView 
          keyboardShouldPersistTaps="always"
          ref={component => { myScrollView = component; }}
          flex padding-20
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}>
            <Picker
              placeholder="Select Class"
              value={selectedClass}
              floatingPlaceholder
              style={{ color: Colors.violet10 }}
              onChange={item => setSelectedClass(item)}
              rightIconSource={dropdown}
              renderCustomModal={renderDialog}
            >
              {_.map(classList, option => (
                <Picker.Item key={classList.value} value={option} disabled={option.disabled} />
              ))}
            </Picker>
            <Picker
              placeholder="Select Section"
              floatingPlaceholder
              style={{ color: Colors.purple10 }}
              value={selectedSection}
              onChange={item => setSelectedSection(item)}
              rightIconSource={dropdown}
              renderCustomModal={renderDialog}
            >
              {_.map(sectionList, option => (
                <Picker.Item key={sectionList.value} value={option} disabled={option.disabled} />
              ))}
            </Picker>
            <Picker
              placeholder="Select Subject"
              topBarProps={{ title: 'Please Select Subject' }}
              floatingPlaceholder
              style={{ color: Colors.green10 }}
              value={selectedSubject}
              onChange={item => setSelectedSubject(item)}
              rightIconSource={dropdown}
              renderCustomModal={renderDialog}
            >
              {_.map(subjectList, option => (
                <Picker.Item key={subjectList.value} value={option} disabled={option.disabled} />
              ))}
            </Picker>
            <View flex paddingTop-40>
            <TextField
              style={styles.TextField}
              placeholder={'Home Work Description (Mandatory'}
              multiline
              scrollEnable={false}
            />
              <Button enableShadow label="Optional: Attach PDF Document" style={{ "marginTop": 20 }} />
            </View>
           
          </ScrollView>
        )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 100
  },
  ƒ: {
    paddingVertical: 100,
    marginTop: 100
  },
  scrollContainer1: {
    flex: 1,
    paddingHorizontal: 5,
    width: "100%",

  },
  scrollContainer2: {
    flex: 2,
    paddingHorizontal: 5,
    width: "100%",
  },
  scrollContentContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 40,
    paddingBottom: 10,
  },
  parallel: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: "100%"
  },
  dateButton: {
    backgroundColor: '#BBDEFB',
    width: '45%',
    margin: 5,
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextButton: {
    backgroundColor: '#BBDEFB',
    width: '100%',
    height: '60%',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  font: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    fontSize: 18,
    color: "white"
  },
  hwDescription: {
    height: 80,
    borderColor: 'olive',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  heading: {
    color: "#1a237e",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    marginBottom: 5
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

export default CreateHW;