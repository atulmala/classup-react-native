import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

const AttendanceSummaryClass = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { theClass } = route.params;
  const { section } = route.params;
  const { subject } = route.params;
  const { month } = route.params;
  const { year } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [workingDays, setWorkingDays] = useState(0);


  const [tableHead] = useState(['S No', 'Student', 'Present', '%.']);
  const [colData] = useState([]);
  const [attendanceRow] = useState([]);
  const [labels] = useState([]);

  useEffect(() => {
    setLoading(true);
    let url1 = serverIP.concat("/academics/get_working_days1/");
    axios
      .get(url1, {
        params: {
          school_id: schoolID,
          year: year,
          class: theClass,
          section: section,
          month: month,
          subject: subject,
        }
      })
      .then(function (response) {
        setWorkingDays(response.data.working_days);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });

    let url2 = serverIP.concat("/academics/get_attendance_summary/");
    axios
      .get(url2, {
        params: {
          school_id: schoolID,
          year: year,
          class: theClass,
          section: section,
          month: month,
          subject: subject,
        }
      })
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let sNo = i + 1;
          colData.push(sNo);
          let name = response.data[i].name;
          labels.push(name);
          let attendance = response.data[i].present_days;
          let percentage = response.data[i].percentage;
          let row = [name, attendance, percentage];
          attendanceRow.push(row);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });


  }, [schoolID]);

  const DisplayModes = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity>
          <Image
            source={require('../assets/done.png')}
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
    let monthYear = month + "-" + year;
    let duration = year == "till_date" ? "Whole Session" : monthYear;
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Attendance: {theClass}-{section} | Sub: {subject}</Text>
        <Text style={styles.headerLine}>Duration: {duration} | Total Days: {workingDays}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'hotpink',
      },
    });
  });

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
      </View> : (
          <ScrollView style={styles.container}>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={tableHead} flexArr={[1, 3, 1, 1]} style={styles.head} textStyle={styles.text} />
              <TableWrapper style={styles.wrapper}>
                <Col data={colData} style={styles.title} textStyle={styles.text} />
                <Rows data={attendanceRow} flexArr={[3, 1, 1, ]} style={styles.row} textStyle={styles.text} />
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

export default AttendanceSummaryClass;
