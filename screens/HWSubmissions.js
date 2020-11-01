import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableWithoutFeedback
} from 'react-native';
import axios from 'axios';

const HWSubmissions = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { hwID } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [submissionList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/homework/get_submission_status/", hwID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let submission = {};
          submission.index = i;
          submission.studentId = response.data[i].student_id;
          submission.student = response.data[i].student;
          submission.submitted = response.data[i].submitted;
          submission.evaluated = response.data[i].evaluated;
          submissionList.push(submission);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });
  }, []);

  const showHWPages = (index) => {
    let studentID = submissionList[index].studentId;
    if (submissionList[index].submitted != "not submitted") {
      navigation.replace('HWPagesList', {
        serverIP: serverIP,
        schoolId: schoolId,
        userName: userName,
        userID: userID,
        studentID: studentID,
        hwID: hwID,
      });
    }
  };

  const CustomRow = ({ title, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => showHWPages(index)}>
        <View style={styles.containerLine}>
          <View style={styles.parallel}>
            <View style={styles.container_title}>
              <Text style={styles.title}>{title.student}</Text>
            </View>
            {title.submitted == "not submitted" &&
              <View style={styles.container_text}>
                <Text style={styles.notSubmitted}> {title.submitted}</Text>
              </View>}
            {title.submitted == "submitted" && title.evaluated != "evaluated" &&
              <View style={styles.container_text}>
                <Text style={styles.submitted}> {title.submitted}</Text>
              </View>}
            {title.submitted == "submitted" && title.evaluated == "evaluated" &&
              <View style={styles.container_text}>
                <Text style={styles.evaluated}> {title.evaluated}</Text>
              </View>}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow title={item} index={item.index} />}
        />
      </View>
    )
  };

  return (
    <View style={styles.container}>
      {isLoading ?
        <View style={styles.loading}>
          <ActivityIndicator size='large' color='#0097A7'/>
        </View> : (
          <CustomListview
            itemList={submissionList}
          />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  parallel: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 2,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 10,
    elevation: 6,
  },
  containerLine: {
    flex: 1,
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 10,
    backgroundColor: 'lavender',
    elevation: 6,
  },
  container_title: {
    flex: 6,
    marginLeft: 8,
    marginRight: 2,
    justifyContent: 'flex-start',
  },
  container_text: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginRight: 2,
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Verdana'
  },
  notSubmitted: {
    fontSize: 16,
    color: 'darkorange',
    fontFamily: 'Verdana'
  },
  submitted: {
    fontSize: 16,
    color: 'dodgerblue',
    fontFamily: 'Verdana'
  },
  evaluated: {
    fontSize: 16,
    color: 'green',
    fontFamily: 'Verdana'
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

export default HWSubmissions;