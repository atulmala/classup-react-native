import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, Alert,
  TouchableOpacity, KeyboardAvoidingView, FlatList
} from 'react-native';

import { Input, ButtonGroup, Button } from '@ui-kitten/components';
import { useHeaderHeight } from '@react-navigation/stack';

import axios from 'axios';

import { AttendanceContext, AttendanceContextProvider } from './AttendanceContext';

const CoScholastic = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { selectedClass } = route.params;
  const { selectedSection } = route.params;
  const { term } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [gradeList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/academics/get_co_cscholastics/", userID, "/",
      selectedClass, "/", selectedSection, "/", term);
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];
          let record = {};
          record.index = i;
          record.id = res.id;
          let rollNo = i + 1;
          let name = res.student;
          let fullName = rollNo + ". " + name;
          record.fullName = fullName;
          record.parent = res.parent;

          record.grade_work_ed = res.work_education;
          record.grade_art_ed = res.art_education;
          record.grade_health_ed = res.health_education;
          record.grade_dsclpln = res.discipline;
          record.remarks = res.teacher_remarks;
          record.promoted = res.promoted_to_class;

          gradeList.push(record);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

  }, [schoolID]);

  let saveGrades = () => {
    let params = {};

    for (let grade of gradeList) {
      let params1 = {};
      params1.term = term;
      params1.work_education = grade.grade_work_ed;
      params1.art_education = grade.grade_art_ed;
      params1.health_education = grade.grade_health_ed;
      params1.discipline = grade.grade_dsclpln;
      params1.teacher_remarks = grade.remarks;
      params1.promoted_to_class = "";

      params[grade.id] = params1;
    }
    let url = serverIP.concat("/academics/save_co_scholastics/");
    axios.post(url, {
      params
    })
      .then(function (response) {
        if (response.data.status == "success") {
          Alert.alert(
            "Grades Successfully Saved",
            "Grades Successfully Saved",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(function (error) {
        console.log("error = ", error);
        Alert.alert(
          "Error Saving Grades",
          "An error occurred while saving grades. Please try again. If error persist pl contact ClassUp Support",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      });
  };

  const CustomRow = ({ title, index }) => {
    const [present, setPresent] = useContext(AttendanceContext);
    return (
      <View style={styles.containerRow}>
        <View style={styles.container_text}>
          <View style={styles.parallel}>
            <Text style={styles.title}>
              {title.fullName}
            </Text>
          </View>
        </View>
        <View style={styles.container_text}>
          <View style={styles.parallel}>
            <Text style={styles.gradeText}>
              Work Education/Pre Vocational Education
            </Text>
          </View>
          <View style={styles.parallel}>
            <View style={styles.parallel}>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='success'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_work_ed = "A";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>A</Button>
              </ButtonGroup>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='warning'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_work_ed = "B";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>B</Button>
              </ButtonGroup>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='danger'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_work_ed = "C";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>C</Button>
              </ButtonGroup>
            </View>
            <View style={styles.awardedGrade}>
              {gradeList[index].grade_work_ed == "A" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='success'>
                  <Button style={styles.gradeButton}>A</Button>
                </ButtonGroup>}
              {gradeList[index].grade_work_ed == "B" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='warning'>
                  <Button style={styles.gradeButton}>B</Button>
                </ButtonGroup>}
              {gradeList[index].grade_work_ed == "C" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='danger'>
                  <Button style={styles.gradeButton}>C</Button>
                </ButtonGroup>}
            </View>
          </View>
        </View>
        <View style={styles.container_text}>
          <View style={styles.parallel}>
            <Text style={styles.gradeText}>
              Art Education
            </Text>
          </View>
          <View style={styles.parallel}>
            <View style={styles.parallel}>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='success'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_art_ed = "A";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>A</Button>
              </ButtonGroup>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='warning'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_art_ed = "B";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>B</Button>
              </ButtonGroup>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='danger'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_art_ed = "C";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>C</Button>
              </ButtonGroup>
            </View>
            <View style={styles.awardedGrade}>
              {gradeList[index].grade_art_ed == "A" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='success'>
                  <Button style={styles.gradeButton}>A</Button>
                </ButtonGroup>}
              {gradeList[index].grade_art_ed == "B" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='warning'>
                  <Button style={styles.gradeButton}>B</Button>
                </ButtonGroup>}
              {gradeList[index].grade_art_ed == "C" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='danger'>
                  <Button style={styles.gradeButton}>C</Button>
                </ButtonGroup>}
            </View>
          </View>
        </View>
        <View style={styles.container_text}>
          <View style={styles.parallel}>
            <Text style={styles.gradeText}>
              Health & Physical Education
            </Text>
          </View>
          <View style={styles.parallel}>
            <View style={styles.parallel}>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='success'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_health_ed = "A";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>A</Button>
              </ButtonGroup>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='warning'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_health_ed = "B";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>B</Button>
              </ButtonGroup>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='danger'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_health_ed = "C";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>C</Button>
              </ButtonGroup>
            </View>
            <View style={styles.awardedGrade}>
              {gradeList[index].grade_health_ed == "A" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='success'>
                  <Button style={styles.gradeButton}>A</Button>
                </ButtonGroup>}
              {gradeList[index].grade_health_ed == "B" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='warning'>
                  <Button style={styles.gradeButton}>B</Button>
                </ButtonGroup>}
              {gradeList[index].grade_health_ed == "C" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='danger'>
                  <Button style={styles.gradeButton}>C</Button>
                </ButtonGroup>}
            </View>
          </View>
        </View>
        <View style={styles.container_text}>
          <View style={styles.parallel}>
            <Text style={styles.gradeText}>
              Discipline
            </Text>
          </View>
          <View style={styles.parallel}>
            <View style={styles.parallel}>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='success'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_dsclpln = "A";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>A</Button>
              </ButtonGroup>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='warning'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_dsclpln = "B";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>B</Button>
              </ButtonGroup>
              <ButtonGroup style={styles.buttonGroup} size='tiny' status='danger'>
                <Button style={styles.gradeButton} onPress={() => {
                  gradeList[index].grade_dsclpln = "C";
                  setPresent(Math.floor(Math.random() * 1001));
                }
                }>C</Button>
              </ButtonGroup>
            </View>
            <View style={styles.awardedGrade}>
              {gradeList[index].grade_dsclpln == "A" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='success'>
                  <Button style={styles.gradeButton}>A</Button>
                </ButtonGroup>}
              {gradeList[index].grade_dsclpln == "B" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='warning'>
                  <Button style={styles.gradeButton}>B</Button>
                </ButtonGroup>}
              {gradeList[index].grade_dsclpln == "C" &&
                <ButtonGroup style={styles.buttonGroup} size='tiny' status='danger'>
                  <Button style={styles.gradeButton}>C</Button>
                </ButtonGroup>}
            </View>
          </View>
        </View>
        <View style={styles.parallel}>
          <Input
            style={styles.select}
            textStyle={{
              ...Platform.select({
                ios: {
                  fontSize: 12,
                },
                android: {
                  fontSize: 14,
                }
              }),
              marginBottom: 5,
              fontWeight: 'bold',
              color: 'darkslategray',
              fontFamily: 'Verdana'
            }}
            status='primary'
            size='small'
            keyboardType="default"
            label={evaProps => <Text {...evaProps}>Class Teacher's Remarks</Text>}
            defaultValue={gradeList[index].remarks}
            onChangeText={text => {
              gradeList[index].remarks = text;
            }}
          />
        </View>
      </View>)
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow
            title={item}
            index={item.index}
          />}
        />
      </View>
    )
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>CoScholastic Grades Entry</Text>
        <Text style={styles.headerLine}>Class: {selectedClass}-{selectedSection}      {term}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'darkolivegreen',
      },
      headerRight: () =>
        <View style={styles.parallel}>
          {!isLoading &&
            <TouchableOpacity style={styles.nextButton} onPress={() => saveGrades()}>
              <Text style={styles.nextText}>  Save  </Text>
            </TouchableOpacity>}
        </View>
    });
  });

  return (<AttendanceContextProvider>
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={useHeaderHeight()}
      style={styles.container} >
      <View style={styles.container}>
        {isLoading ? <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View> : (
            <CustomListview
              itemList={gradeList}
            />)}
      </View>
    </KeyboardAvoidingView>
  </AttendanceContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 2,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  containerRow: {
    flex: 1,
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 10,
    backgroundColor: 'floralwhite',
    elevation: 6,
  },
  title: {
    flex: 2,
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 18,
      }
    }),
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'darkblue',
    fontFamily: 'Verdana'
  },
  gradeText: {
    flex: 2,
    ...Platform.select({
      ios: {
        fontSize: 12,
      },
      android: {
        fontSize: 14,
      }
    }),
    marginTop: 5,
    fontWeight: 'bold',
    color: 'darkblue',
    fontFamily: 'Verdana'
  },
  awardedGrade: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    paddingLeft: 2,
    marginRight: 20,
    marginBottom: 2,
  },
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
  headerLine: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 14,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
  buttonGroup: {
    margin: 2,
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
  evaProps: {
    textShadowColor: "magenta",
    color: 'blue'
  },
  select: {
    flex: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
  },

  gradeButton: {
  },

  nextButton: {
    backgroundColor: 'lavenderblush',
    height: 25,
    margin: 10,
    padding: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextText: {
    fontSize: 12,
    color: 'indigo',
  }
});

export default CoScholastic;