import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';

const ActivityGroups = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { comingFrom } = route.params;

  var [groupList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/activity_groups/get_activity_group_list/", schoolID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let group = {};

          group.index = i;
          group.id = response.data[i].id;
          group.name = response.data[i].group_name;
          group.incharge = response.data[i].group_incharge;
          group.inchargeID = response.data[i].incharge_email;

          groupList.push(group);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const showMembers = (index) => {
    let groupIncharge = groupList[index].inchargeID;
    
    if (userID != groupIncharge) {
      alert("You are not the Incharge of this Group. Only Group Incharge can see the member list!")
    }
    else {
      navigation.navigate('ActivityMembers', {
        serverIP: serverIP,
        userID: userID,
        groupID: groupList[index].id,
        groupName: groupList[index].name,
        comingFrom: comingFrom
      });
    }
  };

  const composeMessage = (index) => {
    let groupIncharge = groupList[index].inchargeID;
    if (userID != groupIncharge) {
      alert("You are not the Incharge of this Group. Only Group can send Message!")
    }
    else {
      navigation.navigate('ComposeMessageActivity', {
        serverIP: serverIP,
        schoolID: schoolID,
        userID: userID,
        groupID: groupList[index].id,
        groupName: groupList[index].name,
        comingFrom: comingFrom
      });
    }
  };

  const HeaderTitle = () => {
    return (
      <View>
        <Text style={styles.headerText}>Select Activity Group</Text>
        <Text style={styles.headerLine2}>Long Press to view  Group Members</Text>
      </View>

    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'yellowgreen',
      },
    });
  });

  const renderItem = ({ item, index }) => (
    <ListItem
      style={styles.title}
      title={item.name}
      description={`${'Group Incharge: '} ${item.incharge}`}
      onPress={() => composeMessage(index)}
      onLongPress={() => showMembers(index)} />
  );


  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <List
            style={styles.title}
            data={groupList}
            keyExtractor={(item) => item.name}
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
    color: 'darkmagenta',
  },
  headerLine2: {
    ...Platform.select({
      ios: {
        fontSize: 12,
      },
      android: {
        fontSize: 12,
      }
    }),
    fontWeight: 'bold',
    color: 'crimson',
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

export default ActivityGroups;
