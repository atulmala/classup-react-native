import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList } from 'react-native';
import { Button, Text, Icon, List, ListItem } from '@ui-kitten/components';
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
          ward.classSec = response.data[i].current_class + " - " + response.data[i].current_section;
          wardList.push(ward);
        }
        console.log("wardList = ", wardList);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  const CustomRow = ({ title, index }) => {
    return (
      <View style={styles.containerRow}>
        <View style={styles.container_text}>
          <Text style={styles.title}>
            {title.name}
          </Text>
        </View>

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
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <CustomListview
            itemList={wardList
            }
          />)}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default SelectWard;