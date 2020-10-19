import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

const AttendanceSummaryStudent = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { studentName } = route.params;

  const [isLoading, setLoading] = useState(true);


  const [tableHead] = useState(['Month', 'Total Days', 'Present', '%.']);
  const [colData] = useState([]);
  const [attendanceRow] = useState([]);
  const [labels] = useState([]);

  useEffect(() => {
    setLoading(true);
    let url = serverIP.concat("/parents/retrieve_stu_att_summary/");
    axios
      .get(url, {
        params: {
          student_id: studentID,
        }
      })
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {          
          let month_year = response.data[i].month_year;
          colData.push(month_year);
          let work_days = response.data[i].work_days;
          let present_days = response.data[i].present_days;
          let percentage = response.data[i].percentage;
          let row = [work_days, present_days, percentage];
          attendanceRow.push(row);
        }
        console.log(labels);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });


  }, [schoolID]);

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Month wise Attendance</Text>
        <Text style={styles.headerLine}>{studentName}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'paleturquoise',
      },
    });
  });

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <ScrollView style={styles.container}>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={tableHead} flexArr={[1, 1, 1, 1]} style={styles.head} textStyle={styles.text} />
              <TableWrapper style={styles.wrapper}>
                <Col data={colData} style={styles.title} textStyle={styles.text} />
                <Rows data={attendanceRow} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text} />
              </TableWrapper>
            </Table>
          </ScrollView>
        )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    paddingTop: 5,
    backgroundColor: 'mintcream'
  },
  head: {
    height: 25,
    backgroundColor: 'khaki',
    fontFamily: 'verdana',
    fontWeight: 'bold'
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    backgroundColor: '#f6f8fa'
  },
  row: {
    height: 25
  },
  text: {
    textAlign: 'left',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 14,
    color: 'darkolivegreen'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'midnightblue',
  },
  headerLine: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'mediumblue',
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

export default AttendanceSummaryStudent;
