import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, StyleSheet, View, ActivityIndicator, Alert,
  TouchableOpacity, KeyboardAvoidingView, FlatList
} from 'react-native';

import { Radio, RadioGroup, Card, List, Text } from '@ui-kitten/components';
import { useHeaderHeight } from '@react-navigation/stack';

import axios from 'axios';

import { AttendanceContext, AttendanceContextProvider } from './AttendanceContext';

const OnlineTest = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { testID } = route.params;
  const { subject } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [questionList] = useState([]);
  const [studentAnswers] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/online_test/get_online_questions/", testID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];
          let question = {};
          let answer = {};
          question.index = i;
          question.id = res.id;
          question.question = res.question;
          question.option_a = res.option_a;
          question.option_b = res.option_b;
          question.option_c = res.option_c;
          question.option_d = res.option_d;

          answer.student_id = studentID;
          answer.id = res.id;
          answer.option_marked = "X";

          questionList.push(question);
          studentAnswers.push(answer);
        }
        setLoading(false);
        console.log(questionList);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

  }, [schoolID]);

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Online Test</Text>
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
      headerRight: () =>
        <View style={styles.parallel}>
          {!isLoading &&
            <TouchableOpacity style={styles.nextButton} onPress={() => saveGrades()}>
              <Text style={styles.nextText}>  Save  </Text>
            </TouchableOpacity>}
        </View>
    });
  });

  const renderItemHeader = (headerProps, info) => (
    <View {...headerProps}>
      <Text category='h6'>
      Q {info.index + 1}. {info.item.question} 
      </Text>
    </View>
  );

  const renderItemFooter = (footerProps) => (
    <Text {...footerProps}>
      By Wikipedia
    </Text>
  );

  const renderItem = (info) => (
    <Card
      style={styles.item}
      status='basic'
      header={headerProps => renderItemHeader(headerProps, info)}
      footer={renderItemFooter}>
       <RadioGroup
        
        >
        <Radio>{info.item.option_a}</Radio>
        <Radio>{info.item.option_b}</Radio>
        <Radio>{info.item.option_c}</Radio>
        <Radio>{info.item.option_d}</Radio>
      </RadioGroup>
    </Card>
  );

  return (<AttendanceContextProvider>
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={useHeaderHeight()}
      style={styles.container} >
      <View style={styles.container}>
        {isLoading ? <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View> : (
            <List
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              data={questionList}
              renderItem={renderItem}
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

export default OnlineTest;