import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableWithoutFeedback } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import axios from 'axios';

const SelectSubject = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { wardID } = route.params;
  const { comingFrom } = route.params;

  var [subjectList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/academics/subject_list/", schoolID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let subject = {};
          subject.id = response.data[i].id;
          subject.subjectName = response.data[i].subject_name;
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

  const showHW = (index) => {
    console.log("index = ", index);
    for (var subject of subjectList)  {
      if (subject.id == index) {
        navigation.navigate('HWListStudent', {
          serverIP: serverIP,
          userID: userID,
          studentID: wardID,
          subject: subject.subjectName,
          comingFrom: comingFrom
        });
      }
    }
  };

  const CustomRow = ({ title, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => showHW(index)}>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.title}>
              {title.subjectName}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>)
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow
            title={item}
            index={item.id}

          />}
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
            itemList={subjectList
            }
          />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 6,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: '#000',
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

export default SelectSubject;
