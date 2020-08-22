import React, { useEffect, useState } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity,
  FlatList, Switch, Image, Button, Alert
} from 'react-native';
import axios from 'axios';


const HWListTeacher = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [hwList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/academics/retrieve_hw/", userID, "/");
    axios
      .get(url)
      .then(function (response) {
        // handle success
        for (var i = 0; i < response.data.length; i++) {
          let hw = {};
          hw.id = response.data[i].id;
          let long_date = response.data[i].due_date;
          let yyyymmdd = long_date.slice(0, 10);
          hw.the_class = response.data[i].the_class;
          hw.section = response.data[i].section;
          hw.subject = response.data[i].subject;

          hw.date = yyyymmdd;

          hw.description = response.data[i].notes;
          hw.location = response.data[i].location;

          hwList.push(hw);
        }
        console.log("hwList = ", hwList);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });
  }, []);

  const BigPlus = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../assets/big_plus.png')}
          style={{
            width: 25,
            height: 25,
            borderRadius: 40 / 2,
            marginLeft: 15,
            marginRight: 10
          }}
        />
      </View>
    );
  }

  const CustomRow = ({ title, index }) => {
    return (
      <View style={styles.containerLine}>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Date:
              <Text style={styles.innerText}> {title.date}</Text>
            </Text>
          </View>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Class:
              <Text style={styles.innerText}> {title.the_class}-{title.section}</Text>
            </Text>
          </View>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/attachmemt.jpg')}
          /><Image
            style={styles.tinyLogo}
            source={require('../assets/delete_icon.jpeg')}
          />
        </View>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Subect:
              <Text style={styles.innerText}> {title.subject}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Description:
              <Text style={styles.innerTextDescription}> {title.description}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.containerRow}>
          <TouchableOpacity style={styles.FacebookStyle} activeOpacity={0.8}>
            <Image
              source={require('../assets/lens.png')}
              style={styles.ImageIconStyle}
            />
            <View style={styles.SeparatorLine} />
            <Text style={styles.TextStyle}> View Submissions </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow title={item} index={item.id} />}
        />
      </View>
    )
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <BigPlus />,
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
    });
  });

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <CustomListview
            itemList={hwList}
          />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
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

    backgroundColor: 'azure',
  },
  containerLine: {
    flex: 1,
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 10,
    backgroundColor: 'azure',
    elevation: 6,
  },
  tinyLogo: {
    margin: 8,
    width: 24,
    height: 24,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'center',
  },
  baseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#708090',
    margin: 4
  },
  innerText: {
    fontSize: 16,
    color: '#4b0082',
    margin: 4
  },
  innerTextDescription: {
    fontSize: 16,
    color: 'dodgerblue',
    margin: 4
  },
  btn1: {
    backgroundColor: '#FFCDD2',
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
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
  FacebookStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'cornflowerblue',
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 10,
    margin: 5,
  },
  TextStyle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 4,
    marginRight: 4,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 10,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  SeparatorLine: {
    backgroundColor: '#fff',
    width: 0,
    height: 40,
  }

});

export default HWListTeacher;