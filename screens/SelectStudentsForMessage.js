import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Divider, List, ListItem, Icon } from '@ui-kitten/components';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const SelectStudentsForMessage = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { comingFrom } = route.params;
  const { the_class } = route.params;
  const { section } = route.params;

  const [studentList] = useState([]);
  const [selectedStudentList, setSelectedStudentList] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [checked, setChecked] = useState(0);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    let url = serverIP.concat("/student/list/", schoolID, "/", the_class, "/", section, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];
          let student = {};
          student.index = i;
          student.id = res.id;
          student.name = res.fist_name + " " + res.last_name;
          student.selected = false;
          studentList.push(student);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const selectAll = () => {
    setLoading(true);
    setAllSelected(!allSelected);
    for (student of studentList) {
      if (allSelected) {
        student.selected = true;
        let position = selectedStudentList.indexOf(student.id);
        if (position > -1) {
          // this student was in the selected list. remove...
          selectedStudentList.splice(position, 1);
        }
        else {
          selectedStudentList.push(student.id);
        }
      }
      else {
        student.selected = false;
        setSelectedStudentList([]);
      }
    }
    console.log("no of selected students = ", selectedStudentList);
    setLoading(false);
  };

  const selectStudents = (index) => {
    for (student of studentList) {
      if (student.index == index) {
        let position = selectedStudentList.indexOf(student.id);
        if (position > -1) {
          // this student was in the selected list. remove...
          selectedStudentList.splice(position, 1);
        }
        else {
          selectedStudentList.push(student.id);
        }
      }
    }
    console.log("selectedStudentList = ", selectedStudentList);
  };

  const composeMessage = () => {
    if (selectedStudentList.length == 0) {
      console.log("no student selected");
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error: No student selected',
        text2: "Please Select at least single students",
      });
      Alert.alert(
        "Student Not Selected",
        "Please Select Student(s)",
        [
          {
            text: "OK", onPress: () => {

            }
          }
        ],
        { cancelable: false }
      );
      return;
    }

    navigation.navigate("ComposeMessageTeacher", {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      the_class: the_class,
      section: section,
      recepients: selectedStudentList,
    });
  };

  const renderItemIcon = (props) => {
    return (
      <Icon {...props} name='checkmark-circle-outline'></Icon>
    );
  };

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${index + 1}.   ${item.name} `}
      accessoryRight={item.selected ? renderItemIcon : null}
      onPress={() => {
        setChecked(Math.floor(Math.random() * 1001));
        studentList[index].selected = !studentList[index].selected;
        selectStudents(index);
      }}
    />
  );

  const ComposeButton = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={selectAll}>
          <Image
            source={require('../assets/select_all.png')}
            style={{
              width: 25,
              height: 25,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={composeMessage}>
          <Image
            source={require('../assets/compose_message2.png')}
            style={{
              width: 30,
              height: 30,
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
      <View style={styles.headerTitle}>
        <Text style={styles.headerText} status='warning' >Select Students</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerRight: () => <ComposeButton />,
      headerStyle: {
        backgroundColor: 'coral',
      },
    });
  });

  return (
    <View style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <List
            style={styles.title}
            data={studentList}
            keyExtractor={(item) => item.name}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem}
          />)}
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default SelectStudentsForMessage;
