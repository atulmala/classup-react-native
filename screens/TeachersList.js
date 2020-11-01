import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';

const TeachersList = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { comingFrom } = route.params;

  var [teacherList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let url = serverIP.concat("/teachers/teacher_list/", schoolID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let teacher = {};

          teacher.index = i;
          teacher.id = response.data[i].id;
          teacher.name = response.data[i].first_name + " " + response.data[i].last_name;
          teacher.login = response.data[i].email;
          teacher.mobile = response.data[i].mobile;

          teacherList.push(teacher);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const updateTeacher = (index) => {
    navigation.navigate('UpdateTeacher', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      id: teacherList[index].id,
      name: teacherList[index].name,
      login: teacherList[index].login,
      mobile: teacherList[index].mobile,
      comingFrom: comingFrom
    });

  };

  const HeaderTitle = () => {
    return (
      <View>
        <Text style={styles.headerText}>Select Teacher </Text>
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

  const renderDescription = ({ item, index }) => {
    return (
      <View style={styles.containerRow}>
      <View style={styles.containerRow}>
        <Image
          style={styles.tinyLogo}
          source={require('../assets/login-id.png')}
        />
        <Text style={styles.innerText}> {teacherList[index].login}</Text>
        </View>
        <View style={styles.containerRow}>
        <View style={[styles.containerRow, {marginLeft: 25}]}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/telephone.png')}
          />
          <Text style={styles.innerText}> {teacherList[index].mobile}</Text>
        </View>
      </View>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <ListItem
      style={styles.title}
      title={item.name}
      description={() => renderDescription(item, index)}
      onPress={() => updateTeacher(index)} />
  );

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
      </View> : (
          <List
            style={styles.title}
            data={teacherList}
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
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: '#FFF',
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
  tinyLogo: {
    ...Platform.select({
      ios: {
        marginTop: 6,
      },
      android: {
        marginTop: 8,
      }
    }),
    width: 16,
    height: 16,
    color: 'red'
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'center',
  },
  innerText: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: '#4b0082',
    margin: 4
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

export default TeachersList;
