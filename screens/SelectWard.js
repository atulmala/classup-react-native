import React, { useEffect, useState, } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import { Text, } from '@ui-kitten/components';
import axios from 'axios';

const SelectWard = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { feeDefaultStatus } = route.params;
  const { welcomeMessage } = route.params;

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
          ward.schoolID = response.data[i].school;
          ward.regNo = response.data[i].student_erp_id;
          ward.name = response.data[i].fist_name + " " + response.data[i].last_name;
          ward.currentClass = response.data[i].current_class;
          ward.currentSection = response.data[i].current_section;
          ward.classSec = response.data[i].current_class + " - " + response.data[i].current_section;

          ward.picUri = "https://classup2.s3.us-east-2.amazonaws.com/media/prod/student_pics/no_image.png";
          if (response.data[i].pic_uri != "not uploaded") {
            ward.picUri = response.data[i].pic_uri;
          }

          wardList.push(ward);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const showParentMenu = (index) => {
    for (var ward of wardList) {
      console.log("id = ", ward.id);
      if (ward.id == index) {
        navigation.navigate('ParentMenu', {
          serverIP: serverIP,
          schoolID: ward.schoolID,
          userID: userID,
          studentID: index,
          studentName: ward.name,
          feeDefaultStatus: feeDefaultStatus,
          welcomeMessage: welcomeMessage
        });
      }
    }
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Select Ward</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#808900',
      },
    });
  });

  const CustomRow = ({ title, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => showParentMenu(index)}>
        <View style={styles.containerRow}>
          <Image source={{ uri: title.picUri }} style={styles.photo} />
          <View style={styles.container_text}>
            <Text style={styles.title}>
              {title.name}
            </Text>
            <Text style={styles.description}>
              {title.classSec}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>)
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
        <ActivityIndicator size='large' color='#0097A7' />
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
    backgroundColor: '#B3D2E5',
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
    backgroundColor: 'papayawhip',
    elevation: 6,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D6386',
    fontFamily: 'Verdana'
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    fontStyle: 'italic',
  },
  photo: {
    height: 45,
    width: 45,
    borderRadius: 10,
    marginLeft: 4,
    borderColor: 'darkorange'
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