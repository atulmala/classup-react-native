import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, StyleSheet, View, ActivityIndicator, TouchableOpacity,
  FlatList, Switch, Image, Alert
} from 'react-native';
import { Button, Card, Layout, Text } from '@ui-kitten/components';
import axios from 'axios';


const SelectWard = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [isLoading, setLoading] = useState(true);
  var [wardList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/student/student_list_for_parents/", userID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let ward = {};
          ward.id = response.data[i].id;
          ward.regNo = response.data[i].student_erp_id;
          ward.name = response.data[i].fist_name + " " + response.data[i].last_name;
          ward.currentClass = response.data[i].current_class;
          ward.currentSection = response.data[i].current_section;
          wardList.push(ward);
        }
        console.log("wardList = ", wardList);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  });

  const Header = (props) => (
    <View {...props}>
      <Text category='h6'>Maldives</Text>
      <Text category='s1'>By Wikipedia</Text>
    </View>
  );

  const Footer = (props) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button
        style={styles.footerControl}
        size='small'>
        Select
      </Button>
    </View>
  );

  const CustomRow = ({ title, index }) => {
    return (
      <View style={styles.containerRow}>
        <Card style={styles.card} header={Header} footer={Footer}>

        </Card>
      </View>)
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
      {isLoading ? <ActivityIndicator size='large' /> : <Header />}
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <CustomListview
            itemList={studentList}
          />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 25,
    backgroundColor: '#ffe4e1'
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
  title: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Verdana'
  },
  tinyLogo: {
    margin: 6,
    width: 16,
    height: 18,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  baseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#708090',
    margin: 4
  },
  innerTotalText: {
    fontSize: 16,
    color: '#00bfff',
    margin: 4
  },
  innerPresentText: {
    fontSize: 16,
    color: '#228b22',
    margin: 4
  },
  innerAbsentText: {
    fontSize: 16,
    color: 'red',
    margin: 4
  },
  innerText: {
    fontSize: 16,
    color: '#4b0082',
    margin: 4
  },
  attendanceSwitch: {
    ...Platform.select({
      ios: {
        flex: 0
      },
      android: {
        flex: 1
      }
    }),
    marginRight: 6,
    marginLeft: 6
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
  button: {
    backgroundColor: "#23b9d1",
    borderRadius: 50,
    color: 'blue',
    paddingRight: 15
  },
  nextButton: {
    backgroundColor: 'lavenderblush',
    height: 25,
    margin: 10,
    padding: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextText: {
    fontSize: 12,
    color: 'indigo',
  }
});

export default SelectWard;