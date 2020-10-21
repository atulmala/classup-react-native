import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';
import ActivityGroups from './ActivityGroups';

const ActivityMembers = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { groupID } = route.params;
  const { groupName } = route.params;
  const { comingFrom } = route.params;

  var [members] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/activity_groups/get_activity_group_members/", groupID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];
          let member = {};

          member.index = i;
          member.id = res.id;
          member.name = res.fist_name + " " + res.last_name + "  (" + res.current_class + "-" + res.current_section + ")";
          members.push(member);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const composeMessage = (index) => {
    navigation.navigate('ComposeMessageActivity', {
      serverIP: serverIP,
      userID: userID,
      groupID: members[index].id,
      category: categories[index],
      comingFrom: comingFrom
    });
  };

  const HeaderTitle = () => {
    return (
      <View>
        <Text style={styles.headerText}>Members List</Text>
        <Text style={styles.headerLine2}>{groupName}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'gold',
      },
    });
  });

  const renderItem = ({ item, index }) => (
    <ListItem style={styles.title} title={`${index + 1}.  ${item.name} `}  />
  );


  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <List
            style={styles.title}
            data={members}
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
    color: 'indianred',
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

export default ActivityMembers;
