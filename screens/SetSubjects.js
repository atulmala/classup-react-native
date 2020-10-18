import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Divider, List, ListItem, Icon } from '@ui-kitten/components';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const SetSubjects = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { comingFrom } = route.params;
  

  const [subjectList] = useState([]);
  const [preSelectedSubjects] = useState([]);
  const [selectedSubjects] = useState({});
  const [unSelectedSubjects] = useState({});

  const [isLoading, setLoading] = useState(true);
  const [checked, setChecked] = useState(0);

  const getSubjectList = () => {
    return axios.get(serverIP.concat("/academics/subject_list/", schoolID, "/"));
  };

  const getTeacherSubjectList = () => {
    return axios.get(serverIP.concat("/teachers/teacher_subject_list/", userID, "/"));
  };

  useEffect(() => {
    axios.all([getSubjectList(), getTeacherSubjectList()]).then(
      axios.spread(function (subjects, teacherSubjects) {
        for (i = 0; i < teacherSubjects.data.length; i++) {
          preSelectedSubjects.push(teacherSubjects.data[i].subject);
        }

        for (var i = 0; i < subjects.data.length; i++) {
          let subject = {};
          subject.index = i;
          subject.id = subjects.data[i].id;
          subject.name = subjects.data[i].subject_name;
          subject.code = subjects.data[i].subject_code;
          
          subject.selected = false;
          if (preSelectedSubjects.findIndex(element => element == subject.name) > -1)  {
            subject.selected = true;
          }
          subjectList.push(subject);
        }

        setLoading(false);
      })
    );
  }, []);

  const renderItemIcon = (props) => {
    return (
      <Icon {...props} name='checkmark-circle-2-outline'></Icon>
    );
  };

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.name} `}
      accessoryRight={item.selected ? renderItemIcon : null}
      onPress={() => {
        setChecked(Math.floor(Math.random() * 1001));
        subjectList[index].selected = !subjectList[index].selected;
        
        if (subjectList[index].selected)  {
          selectedSubjects[subjectList[index].name] = subjectList[index].code;
          delete unSelectedSubjects[subjectList[index].name];
        }
        else  {
          unSelectedSubjects[subjectList[index].name] = subjectList[index].code;
          delete selectedSubjects[subjectList[index].name];
        }
        console.log("selectedSubjects = ", selectedSubjects);
        console.log("unSelectedSubjects = ", unSelectedSubjects);
      }}
    />
  );

  const setSubjects = () =>   {
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want Set Subjects?",
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
                <Layout>
                  <ActivityIndicator style={styles.loading} size='large' />
                </Layout>
              )
            }

            try {
              axios.post(serverIP.concat("/teachers/unset_subjects/", userID, "/"), unSelectedSubjects)
                .then(function (response) {
                  console.log(response);
                });

                axios.post(serverIP.concat("/teachers/set_subjects/", userID, "/"), selectedSubjects)
                .then(function (response) {
                  console.log(response);
                  setLoading(false);
                  Alert.alert(
                    "Subject Set",
                    "Subjects Set.",
                    [
                      {
                        text: "OK", onPress: () => {
                          navigation.navigate('TeacherMenu', {
                            serverIP: serverIP,
                            schoolID: schoolID,
                            userID: userID,
                            userName: userName,
                            comingFrom: "SetSubjects"
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
          }
        }
      ],
      { cancelable: false }
    );
  }

  const HeaderRight = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={setSubjects}>
          <Image
            source={require('../assets/done.png')}
            style={{
              width: 35,
              height: 35,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText} status='warning' >Select Subjects</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'darkkhaki',
      },
      headerRight: () => <HeaderRight />
    });
  });

  return (
    <View style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <List
            style={styles.title}
            data={subjectList}
            keyExtractor={(item) => item.name}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem}
          />)}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 16,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
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

export default SetSubjects;
