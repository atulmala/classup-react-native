import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Divider, List, ListItem, Card, Modal, Text, Button } from '@ui-kitten/components';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const OnlineTestToday = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { comingFrom } = route.params;

  const [testList] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    let url = serverIP.concat("/online_test/get_online_test/", studentID, "/");
    axios
      .get(url)
      .then(function (response) {
        if (response.data.length == 0) {
          console.log("No online test today");
          setVisible(true);
        }
        for (var i = 0; i < response.data.length; i++) {
          let test = {};
          test.id = response.data[i].id;
          test.date = response.data[i].date;
          test.the_class = response.data[i].the_class;
          test.subject = response.data[i].subject;
          test.duration = response.data[i].duration;
          testList.push(test);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

  }, []);

  const showInstructions = (index) => {
    navigation.navigate('OnlineTestInstructions', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      studentID: studentID,
      testID: testList[index].id,
      subject: testList[index].subject
    });

  };

  const renderItem = ({ item, index }) => (
    <ListItem style={styles.title} title={item.subject} onPress={() => showInstructions(index)} />
  );

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Online Test List </Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'darkorange',
      },
    });
  });

  return (
    <View style={styles.container}>
      <Modal visible={visible}>
        <Card disabled={true}>
          <Text style={styles.fo}>No Online Test scheduled for your Class today!</Text>
          <Button onPress={() => setVisible(false)}>
            DISMISS
          </Button>
        </Card>
      </Modal>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <List
            style={styles.title}
            data={testList}
            keyExtractor={(item) => item.id}
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
  title: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Verdana'
  },
  font: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: 'cornsilk'
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

export default OnlineTestToday;