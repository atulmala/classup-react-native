import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';

const SelectSubjectLectures = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { comingFrom } = route.params;

  var [subjectList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/academics/subject_list/", schoolID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let subject = {};
          subject.id = response.data[i].id;
          subject.subjectName = response.data[i].subject_name;
          subjectList.push(subject);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const HeaderTitle = () => {
    return (
      <Text style={styles.headerText}>Select Subject for Lecture</Text>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'burlywood',
      },
    });
  });


  const showLectures = (index) => {
    navigation.navigate('LectureListStudent', {
      serverIP: serverIP,
      userID: userID,
      studentID: studentID,
      subject: subjectList[index].subjectName,
      comingFrom: comingFrom
    });

  };

  const renderItem = ({ item, index }) => (
    <ListItem style={styles.title} title={item.subjectName} onPress={() => showLectures(index)} />
  );


  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
      </View> : (
          <List
            style={styles.title}
            data={subjectList}
            keyExtractor={(item) => item.subjectName}
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
  title: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Verdana'
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
    marginTop: 0,
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

export default SelectSubjectLectures;
