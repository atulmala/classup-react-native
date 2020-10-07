import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';

const SelectExam = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { comingFrom } = route.params;

  const [examList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    switch (comingFrom) {
      case "teacherMenu":
        let url = serverIP.concat("/academics/get_exam_list_teacher/", userID, "/");
        axios
          .get(url)
          .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
              let exam = {};
              exam.id = response.data[i].id;
              exam.title = response.data[i].title;
              exam.examType = response.data[i].exam_type;
              exam.startDate = response.data[i].start_date;
              exam.endDate = response.data[i].end_date;
              exam.startClass = response.data[i].start_class;
              exam.endClass = response.data[i].end_class;

              examList.push(exam);
            }
            setLoading(false);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
        break;
    }
  }, []);

  const scheduleTest = (index) => {
    let exam = {};
    exam.id = examList[index].id;
    exam.title = examList[index].title;
    exam.examType = examList[index].examType;
    exam.startDate = examList[index].startDate;
    exam.endDate = examList[index].endDate;
    exam.startClass = examList[index].startClass;
    exam.endClass = examList[index].endClass;
    navigation.navigate('TestList', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      exam: exam
    });

  };

  const renderItem = ({ item, index }) => (
    <ListItem style={styles.title} title={item.title} onPress={() => scheduleTest(index)} />
  );


  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <List
            style={styles.title}
            data={examList}
            keyExtractor={(item) => item.title}
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

export default SelectExam;