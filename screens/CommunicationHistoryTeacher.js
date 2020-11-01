import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, ActivityIndicator, FlatList, Text, TouchableOpacity } from 'react-native';
import { Card } from '@ui-kitten/components';
import Hyperlink from 'react-native-hyperlink'

import axios from 'axios';

const CommunicationHistoryTeacher = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [messageList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/teachers/message_list/", userID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];

          let message = {};
          message.index = i;
          message.id = res.id;

          let longDate = res.date;
          let yyyymmdd = longDate.substring(0, 10);
          let splittedDate = yyyymmdd.split("-");
          message.date = splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[0];

          message.message = res.message;
          message.theClass = res.the_class;
          message.section = res.section;
          message.sentTo = res.sent_to;

          messageList.push(message);
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
      <Text style={styles.headerText}>Communication History</Text>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'olivedrab',
      },
    });
  });

  const renderItemHeader = (headerProps, message) => (
    <View style={styles.containerLine}>
      <View style={[styles.headerProps, styles.containerRow]}>
        <View style={styles.container_text}>
          <Text style={styles.baseText}>
            Date:
              <Text style={styles.innerText}> {message.date}</Text>
          </Text>
        </View>
      </View>
    </View>
  );

  const renderItemFooter = (headerProps, message) => (
    <View style={styles.containerLine}>
      <View style={[styles.headerProps, styles.containerRow]}>
        <View style={styles.container_text}>
          <TouchableOpacity onPress={() =>  {
            navigation.navigate('RecepientList', {
              serverIP: serverIP,
              userID: userID,
              userName: userName,
              messageID: message.id,
          
            })
          }}>
          <Text style={styles.baseText}>
            Sent to:
              <Text style={[styles.innerText, {textDecorationLine: 'underline'}]}> {message.theClass}-{message.section}: {message.sentTo}</Text>
          </Text>
          </TouchableOpacity>
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
            itemList={messageList}
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

export default CommunicationHistoryTeacher;