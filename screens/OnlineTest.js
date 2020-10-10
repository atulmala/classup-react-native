import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, StyleSheet, View, ActivityIndicator, Alert,
  TouchableOpacity, KeyboardAvoidingView, FlatList, Text
} from 'react-native';

import { Radio, Card, } from '@ui-kitten/components';
import { useHeaderHeight } from '@react-navigation/stack';
import CountDown from 'react-native-countdown-component';

import axios from 'axios';

import { AttendanceContext, AttendanceContextProvider } from './AttendanceContext';

const OnlineTest = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { testID } = route.params;
  const { duration } = route.params;
  const { subject } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [questionList] = useState([]);
  const [studentAnswers] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/online_test/get_online_questions/", testID, "/");
    axios
      .get(url)
      .then(function (response) {
        if (response.data.length == 0) {
          setLoading(false);
          Alert.alert(
            "Error in Download",
            "Error occurred while downloading Questions. Please Exit ClassUp, then try again.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        }
        else {
          for (var i = 0; i < response.data.length; i++) {
            let res = response.data[i];

            let question = {};
            question.index = i;
            question.question_id = res.id;
            question.question = res.question;
            question.option_a = res.option_a.replace(/\.0$/,'');
            question.option_b = res.option_b.replace(/\.0$/,'');
            question.option_c = res.option_c.replace(/\.0$/,'');
            question.option_d = res.option_d.replace(/\.0$/,'');

            let answer = {};
            answer.index = i;
            answer.student_id = studentID;
            answer.question_id = res.id;
            answer.id = res.id;
            answer.option_marked = "X";

            questionList.push(question);
            studentAnswers.push(answer);
          }
        }
        let url1 = serverIP.concat("/online_test/mark_attempted/", studentID, "/", testID, "/");
        axios.post(url1)
          .then(function (response) {
            console.log(response);
          });
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setLoading(false);
        Alert.alert(
          "Error in Download",
          "Error occurred while downloading Questions. Please Exit ClassUp, then try again.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      });
  }, [schoolID]);

  const HeaderTitle = () => {
    return (
      <View style={[styles.headerTitle, styles.parallel]}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Time Left:  </Text>
        </View>
        <View style={styles.headerTitle}>
          <CountDown
            until={60 * duration + 10}
            onFinish={timeOver}
            onPress={() => alert('hello')}
            size={12}
            digitStyle={{ backgroundColor: '#FFF' }}
            digitTxtStyle={{ color: '#1CC625' }}
            timeLabelStyle={{ color: 'bisque', fontsSize: 18 }}
            timeToShow={['M', 'S']}
            timeLabels={{ m: 'MM', s: 'SS' }}
          />
        </View>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'darkslateblue',
      },
      headerLeft: null,
      headerRight: () =>
        <View style={styles.parallel}>
          {!isLoading &&
            <TouchableOpacity style={styles.nextButton} onPress={() => submit()}>
              <Text style={styles.nextText}>  Submit  </Text>
            </TouchableOpacity>}
        </View>
    });
  });

  const renderItemHeader = (headerProps, info) => (
    <View {...headerProps}>
      <Text style={styles.qNo} category='h5' status='primary'>Q {info.index + 1} -  <Text style={styles.question} category='h6' status='info'>
        {info.question}
      </Text></Text>
    </View>
  );

  const CustomRow = ({ title }) => {
    const [checked, setChecked] = useContext(AttendanceContext);
    return (
      <Card
        style={styles.item}
        status='basic'
        header={headerProps => renderItemHeader(headerProps, title)}
      >
        <View style={styles.parallel}>
          <Text style={styles.option} >
            {'A '}
          </Text>
          <Radio
            style={styles.item}
            checked={studentAnswers[title.index].option_marked == 'A'}
            onChange={() => {
              studentAnswers[title.index].option_marked = 'A';
              setChecked(Math.floor(Math.random() * 1001));
              markOption(title, 'A');
            }
            }>
            {title.option_a}
          </Radio>
        </View>
        <View style={styles.parallel}>
          <Text style={styles.option} >
            {'B '}
          </Text>
          <Radio
            style={styles.item}
            checked={studentAnswers[title.index].option_marked == 'B'}
            onChange={() => {
              studentAnswers[title.index].option_marked = 'B';
              setChecked(Math.floor(Math.random() * 1001));
              markOption(title, 'B');
            }
            }>
            {title.option_b}
          </Radio>
        </View>
        <View style={styles.parallel}>
          <Text style={styles.option} >
            {'C '}
          </Text>
          <Radio
            style={styles.item}
            checked={studentAnswers[title.index].option_marked == 'C'}
            onChange={() => {
              studentAnswers[title.index].option_marked = 'C';
              setChecked(Math.floor(Math.random() * 1001));
              markOption(title, 'C');
            }
            }>
            {title.option_c}
          </Radio>
        </View>
        <View style={styles.parallel}>
          <Text style={styles.option} >
            {'D '}
          </Text>
          <Radio
            style={styles.item}
            checked={studentAnswers[title.index].option_marked == 'D'}
            onChange={() => {
              studentAnswers[title.index].option_marked = 'D';
              setChecked(Math.floor(Math.random() * 1001));
              markOption(title, 'D');
            }
            }>
            {title.option_d}
          </Radio>
        </View>
      </Card>)
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

  const markOption = (info, option) => {
    console.log("inside markOption");
    let params = {};
    params.student_id = studentID;
    params.question_id = info.question_id;
    params.answer_marked = option;

    let url = serverIP.concat("/online_test/mark_answer/");
    axios.post(url, {
      params
    })
      .then(function (response) {

      })
      .catch(function (error) {
        console.log("error = ", error);
      });
  }

  const timeOver = () => {
    Alert.alert(
      "Time Over! ",
      "Time Over. Now your answers will be submitted",
      [
        {
          text: "OK", onPress: () => {
            setLoading(true);
            let params = {};
            for (answer of studentAnswers) {
              let params1 = {};
              let question_id = answer.question_id;
              params1.student_id = studentID;
              params1.question_id = question_id;
              params1.option_marked = answer.option_marked;

              params[question_id] = params1;
            }
            let url = serverIP.concat("/online_test/submit_answers/");
            axios.post(url, {
              params
            })
              .then(function (response) {
                setLoading(false);
                Alert.alert(
                  "Answers Submitted",
                  "Answers Submitted. Result will be communicated soon",
                  [
                    {
                      text: "OK", onPress: () => {
                        navigation.navigate('ParentMenu', {
                          serverIP: serverIP,
                          schoolID: schoolID,
                          userID: userID,
                          studentID: studentID,
                          feeDefaultStatus: "no"
                        });
                      }
                    }
                  ],
                  { cancelable: false }
                );
              })
              .catch(function (error) {
                setLoading(false);
                console.log("error = ", error);
              });
          }
        }
      ],
      { cancelable: false }
    );
  }

  const submit = () => {
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to Submit your answers? Your attempt will be counted.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            setLoading(true);
            let params = {};
            for (answer of studentAnswers) {
              let params1 = {};
              let question_id = answer.question_id;
              params1.student_id = studentID;
              params1.question_id = question_id;
              params1.option_marked = answer.option_marked;

              params[question_id] = params1;
              console.log("params = ", params);
            }
            let url = serverIP.concat("/online_test/submit_answers/");
            axios.post(url, {
              params
            })
              .then(function (response) {
                setLoading(false);
                Alert.alert(
                  "Answers Submitted",
                  "Answers Submitted. Result will be communicated soon",
                  [
                    {
                      text: "OK", onPress: () => {
                        navigation.navigate('ParentMenu', {
                          serverIP: serverIP,
                          schoolID: schoolID,
                          userID: userID,
                          studentID: studentID,
                          feeDefaultStatus: "no"
                        });
                      }
                    }
                  ],
                  { cancelable: false }
                );
              })
              .catch(function (error) {
                setLoading(false);
                console.log("error = ", error);
              });

          }
        }
      ],
      { cancelable: false }
    );
  }

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
              itemList={questionList}
            />)}
      </View>
    </KeyboardAvoidingView>
  </AttendanceContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'olive',
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 2,
    marginLeft: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  headerProps: {
    margin: 4,
    padding: 4,
  },
  contentContainer: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  controlContainer: {
    borderRadius: 4,
    margin: 4,
    padding: 4,
    backgroundColor: '#3366FF',
  },
  item: {
    marginVertical: 4,

  },
  headerTitle: {
    marginTop: 4,
  },
  qNo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue'
  },
  question: {
    fontSize: 16,
    color: 'navy'
  },
  option: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'darkslategrey'
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
    marginTop: 4,
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

  nextButton: {
    backgroundColor: 'lavenderblush',
    height: 35,
    margin: 10,
    padding: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextText: {
    fontSize: 16,
    fontFamily: 'verdana',
    color: 'indigo',
  }
});

export default OnlineTest;