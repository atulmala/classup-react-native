import React, { useEffect, useState } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, Alert, Linking
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const HWSubmissions = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { hwId } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [submissionList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    let url = serverIP.concat("/homework/get_submission_status/", hwId, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let submission = {};
          submission.student_id = response.data[i].student_id;
          submission.student = response.data[i].student;
          submission.submitted = response.data[i].submitted;
          submission.evaluated = response.data[i].evaluated;
          submissionList.push(submission);
        }
        console.log("submissionList = ", submissionList);

        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });
  }, [isFocused]);

  const CustomRow = ({ title, index }) => {
    return (
      <View style={styles.containerLine}>
        <View style={styles.containerRow}>
          <View style={styles.container_title}>
            <Text style={styles.title}>{title.student}</Text>
          </View>
          {title.submitted == "not submitted" &&
            <View style={styles.container_text}>
              <Text style={styles.notSubmitted}> {title.submitted}</Text>
            </View>}
          {title.submitted == "submitted" &&
            <View style={styles.container_text}>
              <Text style={styles.submitted}> {title.submitted}</Text>
            </View>}
          {title.submitted == "evaluated" &&
            <View style={styles.container_text}>
              <Text style={styles.evaluated}> {title.submitted}</Text>
            </View>}
        </View>
      </View>
    )
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow title={item} index={item.id} />}
        />
      </View>
    )
  };

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
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
    flexDirection: 'column',
    marginRight: 2,
    justifyContent: 'center',
  },
  container_text: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginRight: 2,
  },
  title: {
    fontSize: 16,
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
    color: 'lawngreen',
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