import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';

const SelectCategories = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { comingFrom } = route.params;

  var [categories] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/parents/retrieve_categories/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          
          categories.push(response.data[i].category);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const composeMessage = (index) => {
    navigation.navigate('ComposeMessageParent', {
      serverIP: serverIP,
      userID: userID,
      studentID: studentID,
      category: categories[index],
      comingFrom: comingFrom
    });
  };

  const HeaderTitle = () => {
    return (
      <Text style={styles.headerText}>Select Category</Text>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'tomato',
      },
    });
  });

  const renderItem = ({ item, index }) => (
    <ListItem style={styles.title} title={item} onPress={() => composeMessage(index)} />
  );


  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
      </View> : (
          <List
            style={styles.title}
            data={categories}
            keyExtractor={(item) => item.subjectName}
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
    color: 'white',
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

export default SelectCategories;
