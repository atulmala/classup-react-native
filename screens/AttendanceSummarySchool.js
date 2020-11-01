import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

const AttendanceSummarySchool = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { date } = route.params;
  const { month } = route.params;
  const { year } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [tableHead] = useState(['S No', 'Class', 'Attendance', '%.']);
  const [colData] = useState([]);
  const [attendanceRow] = useState([]);
  const [total, setTotal] = useState();
  const [totalPerc, setTotalPerc] = useState();
  const [labels] = useState([]);

  useEffect(() => {
    let url2 = serverIP.concat("/operations/att_summary_school_device/");
    axios
      .get(url2, {
        params: {
          school_id: schoolID,
          year: year,
          month: month,
          date: date
        }
      })
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let sNo = i + 1;
          colData.push(sNo);
          let theClass = response.data[i].class;
          labels.push(theClass);
          let attendance = response.data[i].attendance;
          let percentage = response.data[i].percentage;
          let row = [theClass, attendance, percentage];
          setTotal(response.data[i].attendance);
          setTotalPerc(response.data[i].percentage);
          attendanceRow.push(row);
        }
        colData.pop();
        attendanceRow.pop();

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
        <Text style={styles.headerText}>Attendance Summary </Text>
        <Text style={styles.headerLine}>Date: {date}/{month}/{year} | Total: {total} ({totalPerc})</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#7bdcb5',
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
              <Row data={tableHead} flexArr={[1, 2, 2, 1]} style={styles.head} textStyle={styles.text} />
              <TableWrapper style={styles.wrapper}>
                <Col data={colData} style={styles.title} textStyle={styles.text} />
                <Rows data={attendanceRow} flexArr={[2, 2, 1]} style={styles.row} textStyle={styles.text} />
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
    backgroundColor: '#8ed1fc',
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

export default AttendanceSummarySchool;
