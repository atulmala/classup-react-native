import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import { HeaderBackButton } from '@react-navigation/stack';
import axios from 'axios';

const HWPagesList = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;

  var [hwPages] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/homework/get_hw_pages/", hwID, "/", studentID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          hwPage = {};
          hwPage.key = "Page # " + (i + 1);
          hwPage.uri = response.data[i].location;
          hwPage.title = "Page # " + (i + 1);
          hwPages.push(hwPage);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.title} status='success' >Please Click on a page to open</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerStyle: {
        backgroundColor: 'sienna',
      },
    });
  });

  const checkHW = (index) => {
    navigation.navigate('CheckHW', {
      serverIP: serverIP,
      schoolID: schoolID,
      userName: userName,
      userID: userID,
      studentID: studentID,
      hwID: hwID,
      uri: hwPages[index].uri,
      sequence: index + 1
    });
    
  };

  const renderItem = ({ item, index }) => (
    <ListItem title={item.title} onPress={() => checkHW(index)}/>
  );

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
    <List
      style={styles.container}
      data={hwPages}
      keyExtractor={(item) => item.title}
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
    color: 'white',
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

export default HWPagesList;
