import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';

const UpcomingTests = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { comingFrom } = route.params;

  const [testList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/academics/pending_test_list_parents/", studentID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let test = {};
          test.id = response.data[i].id;

          let yyyymmdd = response.data[i].date_conducted.split("-");
          test.date = yyyymmdd[2] + "-" + yyyymmdd[1] + "-" + yyyymmdd[0];
          test.subject = response.data[i].subject;

          testList.push(test);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

  }, []);

  const renderDescription = (description) => (
    <Text style={{
      margin: 2,
      fontFamily: 'verdana',
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black'
    }} name='person'>{description}</Text>
  );

  const renderItem = ({ item, index }) => (
    <ListItem
      title={item.date}
      description={renderDescription(item.subject)}
    />
  );

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <List
            style={styles.title}
            data={testList}
            keyExtractor={(item) => item.subject}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem}
          />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    margin: 2,
    fontFamily: 'verdana',
    fontSize: 26
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

export default UpcomingTests;