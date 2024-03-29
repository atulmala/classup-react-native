import React, { useEffect, useState } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, Alert, Linking
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const HWListTeacher = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [hwList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    let url = serverIP.concat("/academics/retrieve_hw/", userID, "/");
    axios
      .get(url)
      .then(function (response) {
        // handle success
        if (response.data.length == 0) {
          let dummyHW = {
            id: '-1000',
            date: 'xxxx/xx/xx',
            the_class: 'X',
            section: 'X',
            subject: 'X',
            location: 'X',
            description: 'No HW Created. Please click the Plus Button above to create'
          };
          hwList.push(dummyHW);
        }
        else {
          hwList.length = 0;
          for (var i = 0; i < response.data.length; i++) {
            let hw = {};
            hw.id = response.data[i].id;
            
            let long_date = response.data[i].due_date;
            let yyyymmdd = long_date.slice(0, 10).split("-");
            let ddmmyyyy = yyyymmdd[2] + "-" + yyyymmdd[1] + "-" + yyyymmdd[0];
            hw.date = ddmmyyyy;

            hw.the_class = response.data[i].the_class;
            hw.section = response.data[i].section;
            hw.subject = response.data[i].subject;
            hw.description = response.data[i].notes;
            hw.location = response.data[i].location;

            hwList.push(hw);
          }
          hwList.reverse();
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });
  }, [isFocused]);

  const BigPlus = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onPress}>
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
        </TouchableOpacity>
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
          <TouchableOpacity onPress={() => showSubmissins(index)}>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/submissions.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteHW(index)}>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/delete_icon.jpeg')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.container_text}>
            <Text style={styles.baseText}>
              Subject:
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
        {title.location != null &&
          <View style={styles.containerRow}>
            <View style={styles.container_text}>
              <Text style={styles.baseText} onPress={() => openURL(title)}>
                Attachment:
              <Text style={styles.hyperlink}>Tap here to view</Text>
              </Text>
            </View>
          </View>}
        
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

  const openURL = (title) => {
    Linking.openURL(title.location)
  }

  const createHW = () => {
    navigation.navigate('CreateHW', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      comingFrom: "teacherMenu"
    });
  };

  const showSubmissins = (index) => {
    navigation.navigate('HWSubmissions', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      hwID: index,
      comingFrom: "hwListTeacher"
    });
  };

  const deleteHW = (index) => {
    if (index < 0) {
      Alert.alert(
        "Dummy Placeholder HW",
        "This is a dummy HW. Will be automatically deleted when you have created real HW!",
        [
          {
            text: "OK", onPress: () => {
            }
          }
        ],
        { cancelable: false }
      );
    }
    else {
      Alert.alert(
        "Please Confirm ",
        "Are You sure you want to Delete this HW?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK", onPress: () => {
              setLoading(true);
              {
                isLoading && (
                  <View>
                    <ActivityIndicator style={styles.loading} size='large' />
                  </View>
                )
              }

              try {
                axios.delete(serverIP.concat("/academics/delete_hw/", index, "/"))
                  .then(function (response) {
                    console.log(response);
                    setLoading(false);
                    Alert.alert(
                      "HW Deleted",
                      "Home Work Deleted.",
                      [
                        {
                          text: "OK", onPress: () => {
                            navigation.navigate('HWListTeacher', {
                              serverIP: serverIP,
                              schoolID: schoolID,
                              userID: userID,
                              userName: userName,
                              comingFrom: "CreateHW"
                            });
                          }
                        }
                      ],
                      { cancelable: false }
                    );
                  });
              } catch (error) {
                console.error(error);
              }
              var position = 0;
              for (var hw of hwList) {
                if (hw.id == index) {
                  hwList.splice(position, 1)
                  break
                }
                else {
                  position++;
                }
              }
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <BigPlus onPress={createHW} />,
      headerStyle: {
        backgroundColor: 'coral',
      },
    });
  });

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
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
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),

    fontWeight: 'bold',
    color: '#708090',
    margin: 4
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
  innerTextDescription: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'indigo',
    margin: 4
  },
  hyperlink: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'dodgerblue',
    margin: 4
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
  TextStyle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 4,
    marginRight: 4,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  

});

export default HWListTeacher;