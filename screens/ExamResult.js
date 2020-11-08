import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Image, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { Button, ButtonGroup, Layout } from '@ui-kitten/components';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { VictoryBar, VictoryChart, VictoryLegend, VictoryGroup, VictoryAxis, VictoryLabel, VictoryTheme } from "victory-native";

const ExamResult = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { studentName } = route.params;
  const { exam } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [tableMode, setTableMode] = useState(true);
  const [graphMode, setGraphMode] = useState(false);

  const [tableHead] = useState(['S No', 'Subject', 'MM', 'Marks', 'High.', 'Ave.']);
  const [subjectList] = useState([]);
  const [subjectMarks] = useState([]);
  const [labels] = useState([]);

  const [marksArray] = useState([]);
  const [highestArray] = useState([]);
  const [averageArray] = useState([]);

  // retrieve the list of classes, sections, and subjects for this school
  const getResults = () => {
    return axios.get(serverIP.concat("/parents/get_exam_result/", studentID, "/", exam.id, "/"));
  };

  useEffect(() => {
    axios.all([getResults()]).then(
      axios.spread(function (results) {
        let marksRow;
        for (var i = 0; i < results.data.length; i++) {
          let s_no = i + 1;
          let subject = results.data[i].subject;
          labels.push(subject);
          let max_marks = results.data[i].max_marks;
          let marks = results.data[i].marks;
          if (marks < 0 || marks == " ") {
            marks = "ABS";
          }
          let m = {};
          m.x = subject;
          m.y = marks;
          m.label = marks;

          let highest = results.data[i].highest;
          let h = {};
          h.x = subject;
          h.y = highest;
          h.label = highest;

          let average = results.data[i].average;
          let a = {};
          a.x = subject;
          a.y = parseInt(average);
          a.label = parseInt(average);

          if (max_marks != "Grade Based") {
            if (marks >= 0) {
              marksArray.push(m);
              highestArray.push(h);
              averageArray.push(a);
            }
          }

          subjectList.push(s_no);
          marksRow = [subject, max_marks, marks, highest, average];
          subjectMarks.push(marksRow);
        }

        setLoading(false);
      })
    );
  }, [schoolID]);

  const DisplayModes = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => {
          setGraphMode(false);
          setTableMode(true);
        }}>
          <Image
            source={require('../assets/tables.png')}
            style={{
              width: 30,
              height: 30,
              marginLeft: 15,
              marginRight: 0
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setTableMode(false);
          setGraphMode(true);
        }}>
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
        <ActivityIndicator size='large' color='#0097A7' />
      </View> : (
          <View style={styles.container}>
            { tableMode &&
              <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                <Row data={tableHead} flexArr={[1, 2, 1, 1, 1, 1]} style={styles.head} textStyle={styles.text} />
                <TableWrapper style={styles.wrapper}>
                  <Col data={subjectList} style={styles.title} textStyle={styles.text} />
                  <Rows data={subjectMarks} flexArr={[2, 1, 1, 1, 1]} style={styles.row} textStyle={styles.text} />
                </TableWrapper>
              </Table>
            }
            { graphMode &&
              <View style={styles.container}>
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={400}
                  style={{
                    flex: 1,
                    parent: { maxWidth: "120%", width: "100%" }
                  }}
                  domainPadding={{ x: 25 }}
                >
                  <VictoryLegend x={80} y={0}
                    centerTitle
                    orientation="horizontal"
                    style={{ title: { fontSize: 20 } }}
                    data={[
                      { name: "Your Marks", symbol: { fill: "darkslateblue" } },
                      { name: "Highest", symbol: { fill: "darkgreen" } },
                      { name: "Average", symbol: { fill: "orangered" } }
                    ]}
                  />
                  <VictoryAxis
                    axisLabelComponent={<VictoryLabel />}
                    scale={{ x: "time" }}
                    style={{
                      axisLabel: {
                        fontFamily: "verdana",
                        fontWeight: 100,
                        letterSpacing: "1px",
                        stroke: "white",
                        fontSize: 10,
                      },
                      grid: { stroke: "lightgrey" },
                      tickLabels: {
                        padding: -5,
                        fontFamily: "verdana",
                        fontWeight: 'bold',
                        letterSpacing: "1px",
                        stroke: "#61dafb",
                        fontSize: 10,
                        angle: 335,
                        verticalAnchor: "end",
                        textAnchor: 'end'
                      }
                    }}
                  />
                  <VictoryAxis
                    dependentAxis={true}
                    axisLabelComponent={<VictoryLabel />}
                    label={"marks"}
                    fixLabelOverlap={true}
                    style={{
                      axisLabel: {
                        fontFamily: "verdana",
                        fontWeight: 100,
                        letterSpacing: "1px",
                        stroke: "white",
                        fontSize: 10,
                        margin: "30px"
                      },
                      grid: { stroke: "lightgrey" },
                      tickLabels: {
                        textAnchor: 'start',
                        fontFamily: "verdana",
                        fontWeight: 100,
                        letterSpacing: "1px",
                        stroke: "#61dafb",
                        fontSize: 10,
                        marginBlock: "20px"
                      }
                    }}
                  />
                  <VictoryGroup
                    offset={10}
                    style={{ data: { width: 10 } }}
                    colorScale={["darkslateblue", "darkgreen", "orangered"]}
                  >
                    <VictoryBar
                      style={{ data: { width: 15 } }}
                      data={marksArray}
                      labelComponent={
                        <VictoryLabel
                          style={{
                            fontFamily: 'verdana',
                            fontSize: 10,
                            color: "darkslateblue"
                          }}
                          verticalAnchor="middle"
                          textAnchor="end" />
                      }
                      animate={{
                        duration: 10000,
                        easing: "bounce"
                      }}
                    />
                    <VictoryBar
                      style={{ data: { width: 15 } }}
                      data={highestArray}
                      labelComponent={
                        <VictoryLabel
                          style={{
                            fontFamily: 'verdana',
                            fontSize: 10,
                            color: "darkgreen"
                          }}
                          verticalAnchor="middle"
                          textAnchor="start" />
                      }
                      animate={{
                        duration: 10000,
                        easing: "bounce"
                      }}
                    />
                    <VictoryBar
                      style={{ data: { width: 10 } }}
                      data={averageArray}
                      labelComponent={
                        <VictoryLabel
                          dy={-12}
                          style={{
                            fontFamily: 'verdana',
                            fontSize: 10,
                            color: "orangered"
                          }}
                          verticalAnchor="middle"
                          textAnchor="start" />
                      }
                      animate={{
                        duration: 10000,
                        easing: "bounce"
                      }}
                    />
                  </VictoryGroup>
                </VictoryChart>

              </View>
            }
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
    backgroundColor: 'mintcream'
  },
  head: {
    height: 40,
    backgroundColor: 'khaki',
    fontFamily: 'verdana',
    fontWeight: 'bold'
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
    textAlign: 'center',
    fontSize: 14,
    color: 'darkolivegreen'
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100
  },
  headerText: {
    fontSize: 16,
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
