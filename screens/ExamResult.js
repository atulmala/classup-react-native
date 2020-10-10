import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { Layout } from '@ui-kitten/components';
import axios from 'axios';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

const ExamResult = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { studentName } = route.params;
  const { exam } = route.params;

  const [resultList] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [tableMode, setTableMode] = useState(true);
  const [graphMode, setGraphMode] = useState(false);

  const [tableHead] = useState(['S No', 'Subject', 'MM', 'Marks', 'High.', 'Ave.']);
  const [subjectList] = useState([]);
  const [subjectMarks] = useState([]);

  // retrieve the list of classes, sections, and subjects for this school
  const getResults = () => {
    return axios.get(serverIP.concat("/parents/get_exam_result/", studentID, "/", exam.id, "/"));
  };

  useEffect(() => {
    axios.all([getResults()]).then(
      axios.spread(function (results) {
        for (var i = 0; i < results.data.length; i++) {
          let s_no = i + 1;
          let subject = results.data[i].subject;
          let max_marks = results.data[i].max_marks;
          let marks = results.data[i].marks;
          let appeared = results.data[i].appeared;
          let highest = results.data[i].highest;
          let average = results.data[i].average;

          subjectList.push(s_no);
          let marksRow = [subject, max_marks, marks, highest, average];
          subjectMarks.push(marksRow);
        }
        console.log("resultList = ", resultList);
        setLoading(false);
      })
    );
  }, [schoolID]);

  const DisplayModes = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={require('../assets/tables.png')}
            style={{
              width: 30,
              height: 30,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={require('../assets/bar_chart.png')}
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
        <Text style={styles.headerText}>Result for {exam.title}</Text>
        <Text style={styles.headerLine}>{studentName}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerRight: () => <DisplayModes />,
      headerStyle: {
        backgroundColor: 'peru',
      },
    });
  });

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <View style={styles.container}>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Row data={tableHead} flexArr={[1, 2, 1, 1, 1, 1]} style={styles.head} textStyle={styles.text} />
              <TableWrapper style={styles.wrapper}>
                <Col data={subjectList} style={styles.title}  textStyle={styles.text} />
                <Rows data={subjectMarks} flexArr={[2, 1, 1, 1, 1]} style={styles.row} textStyle={styles.text} />
              </TableWrapper>
            </Table>
          </View>
        )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    paddingTop: 5,
    backgroundColor: '#fff'
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff'
  },
  wrapper: {
    flexDirection: 'row',

  },
  title: {
    flex: 1,
    backgroundColor: '#f6f8fa'
  },
  row: {
    height: 28
  },
  text: {
    textAlign: 'left',
    paddingLeft: 5
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerLine: {
    fontSize: 14,
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

export default ExamResult;
