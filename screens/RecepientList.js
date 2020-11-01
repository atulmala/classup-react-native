import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, ActivityIndicator, FlatList, Text, TouchableOpacity } from 'react-native';
import { Card } from '@ui-kitten/components';
import Hyperlink from 'react-native-hyperlink'

import axios from 'axios';

const RecepientList = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { messageID } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [receiverList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/teachers/receivers_list/", messageID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];

          let receiver = {};
          receiver.index = i;
          receiver.id = res.id;

          let longDate = res.date;
          let yyyymmdd = longDate.substring(0, 10);
          let splittedDate = yyyymmdd.split("-");
          receiver.date = splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[0];

          receiver.student = res.student;
          receiver.message = res.full_message;
          receiver.outcome = res.outcome;
          receiver.delivereyMode = res.status;

          receiverList.push(receiver);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setLoading(false);
      });
  }, []);

  const HeaderTitle = () => {
    return (
      <Text style={styles.headerText}>Message Delivery Status</Text>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'fuchsia',
      },
    });
  });

  const renderItemHeader = (headerProps, receiver) => (
    <View style={styles.containerLine}>
      <View style={[styles.headerProps, styles.containerRow]}>
        <View style={styles.container_text}>
          <Text style={styles.baseText}>
            Student:
              <Text style={styles.innerText}> {receiver.student}</Text>
          </Text>
        </View>
      </View>
    </View>
  );

  const renderItemFooter = (headerProps, receiver) => (
    <View style={styles.containerLine}>
      <View style={[styles.headerProps, styles.containerRow]}>
        <View style={styles.container_text}>
          <Text style={styles.baseText}>
            Delivery Status:
            {receiver.delivereyMode != "Notification" &&
              <Text style={[styles.innerText]}> {receiver.outcome}</Text>}
            {receiver.delivereyMode == "Notification" &&
              <Text style={[styles.innerText]}> Delivered</Text>}
          </Text>
          <Text style={styles.baseText}>
            Delivery Mode:
            {receiver.delivereyMode == "Notification" &&
              <Text style={[styles.innerText]}> via Notification</Text>}
            {receiver.delivereyMode != "Notification" &&
              <Text style={[styles.innerText]}> via SMS</Text>}
          </Text>
        </View>
      </View>
    </View>
  );

  const CustomRow = ({ title }) => {
    return (
      <Card
        style={styles.item}
        header={headerProps => renderItemHeader(headerProps, title)}
        footer={headerProps => renderItemFooter(headerProps, title)}
      >
        <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9', fontSize: 14, textDecorationLine: 'underline', }}>
          <Text style={styles.messageText}>{title.message}</Text>
        </Hyperlink>
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

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
      </View> : (
          <CustomListview
            itemList={receiverList}
          />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'olive',
  },
  headerProps: {
    margin: 2,
  },
  item: {
    marginVertical: 1,
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
    fontWeight: 'bold',
    color: 'white',
  },
  containerLine: {
    flex: 1,
    paddingLeft: 12,
    marginRight: 4,
    elevation: 6,
  },
  container_text: {
    flex: 1,
  },
  baseText: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    marginBottom: 4,
    fontFamily: 'verdana',
    color: 'mediumslateblue',
  },
  innerText: {
    ...Platform.select({
      ios: {
        fontFamily: 'verdana',
        fontSize: 14,
      },
      android: {
        fontFamily: 'sans-serif',
        fontSize: 16,
      }
    }),
    fontWeight: 'bold',
    color: 'mediumblue',
  },
  messageText: {
    ...Platform.select({
      ios: {
        fontFamily: 'verdana',
        fontSize: 14,
      },
      android: {
        fontFamily: 'sans-serif',
        fontSize: 16,
      }
    }),
    marginLeft: -10,
    marginTop: -10,
    fontWeight: '400',
    color: 'darkslateblue',
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

export default RecepientList;