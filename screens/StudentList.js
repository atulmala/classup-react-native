import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';

const StudentList = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { selectedClass } = route.params;
  const { selectedSection } = route.params;
  const { comingFrom } = route.params;

  var [studentList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/student/list/", schoolID, "/", selectedClass, "/", selectedSection, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let student = {};

          student.index = i;
          student.id = response.data[i].id;
          student.regNo = response.data[i].student_erp_id;
          student.name = response.data[i].fist_name + " " + response.data[i].last_name;
          student.parent = response.data[i].parent;

          studentList.push(student);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const updateStudent = (index) => {
    navigation.navigate('UpdateStudent', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      id: studentList[index].id,
      name: studentList[index].name,
      login: studentList[index].login,
      mobile: studentList[index].mobile,
      comingFrom: comingFrom
    });

  };

  const HeaderTitle = () => {
    return (
      <View>
        <Text style={styles.headerText}>Select Student </Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#795548',
      },
    });
  });

  const renderDescription = ({ item, index }) => {
    return (
      <View style={styles.containerRow}>
        <View style={styles.containerRow1}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/id_card.png')}
          />
          <Text style={styles.innerText}> {studentList[index].regNo}</Text>
        </View>
        <View style={styles.containerRow2}>
          <View style={[styles.containerRow, { marginLeft: 25 }]}>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/father.png')}
            />
            <Text style={styles.innerText}> {studentList[index].parent}</Text>
          </View>
        </View>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <ListItem
      style={styles.title}
      title={item.name}
      description={() => renderDescription(item, index)}
      onPress={() => updateStudent(index)} />
  );

  return (
    <View style={styles.container}>
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
  container: {
    flex: 1,
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: '#FFF',
  },
  containerRow1: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: '#FFF',
  },
  containerRow2: {
    flex: 2,
    flexDirection: 'row',
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: '#FFF',
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 18,
      },
      android: {
        fontSize: 18,
      }
    }),
    fontWeight: 'bold',
    color: '#e1bee7',
  },
  tinyLogo: {
    marginTop: 6,
    width: 20,
    height: 20,
    color: 'red'
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'center',
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
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Verdana'
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

export default StudentList;
