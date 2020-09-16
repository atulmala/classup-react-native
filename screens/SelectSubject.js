import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity,
  FlatList, Switch, Image, Button, Alert
} from 'react-native';
import axios from 'axios';
import { Divider, List, ListItem } from '@ui-kitten/components';

const data = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
});

const SelectSubject = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { comingFrom } = route.params;

  var [subjectList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/academics/subject_list/", schoolId, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let subject = {};
          subject.id = response.data[i].id;
          subject.subject_name = response.data[i].subject_name;
          subjectList.push(subject);
        }
        console.log("subjectList = ", subjectList);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  });

  const renderItem = ({ item, index }) => (
    <ListItem title={item.subject_name}/>
  );

  return (
    <List
      style={styles.container}
      data={data}
      ItemSeparatorComponent={Divider}
      renderItem={renderItem}
    />
  );

};

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
  },
});

export default SelectSubject;
