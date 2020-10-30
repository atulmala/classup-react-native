import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-picker';

const ParentMenu = ({ route, navigation }) => {

  const testPress = () => {
    Alert.alert('was pressed');
    console.log('was pressed');
  };

  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { studentName } = route.params;
  const { feeDefaultStatus } = route.params;
  const { welcomeMessage } = route.params;

  const showToast = () => {
    if (feeDefaultStatus == "yes") {
      Alert.alert(
        "Fee Outstanding!", welcomeMessage,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ],
        { cancelable: false }
      );
      Toast.show({
        type: 'error',
        text1: 'Fee Status: Pending',
        text2: welcomeMessage,
      });

    }
    else {

    }
  };
  showToast();

  let params = {
    serverIP: serverIP,
    schoolID: schoolID,
    userID: userID,
    studentID: studentID,
    studentName: studentName,
    userName: userName,
    comingFrom: "ParentMenu"
  };

  const nextScreen = (screen) => {
    navigation.navigate(screen, params);
  };

  const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  

  const pickImage = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        console.log (response.uri);
      }
    });
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Parent/Student Menu</Text>
        <Text style={styles.headerLine}>Student: {studentName}</Text>
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
    });
  });

  return (
    <ScrollView style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'chocolate' }]} onPress={() => nextScreen('AttendanceSummaryStudent')}>
          <Text style={styles.font}>Month Wise Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[button, { backgroundColor: 'midnightblue' }]} onPress={testPress}>
          <Text style={styles.font}>Time Table</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'darkolivegreen' }]} onPress={() => nextScreen('SelectSubject')}>
          <Text style={styles.font}>Home Work</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[button, { backgroundColor: 'dodgerblue' }]} onPress={() => nextScreen('SelectSubjectLectures')}>
          <Text style={styles.font}>Online Classes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'goldenrod' }]} onPress={() => nextScreen('UpcomingTests')}>
          <Text style={styles.font}>Upcoming Tests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[button, { backgroundColor: 'brown' }]} onPress={() => nextScreen('OnlineTestToday')}>
          <Text style={styles.font}>Online Test</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'darkorchid' }]} onPress={() => nextScreen('SelectExam')}>
          <Text style={styles.font}>Exam Results</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[button, { backgroundColor: 'darkslategray' }]} onPress={() => nextScreen('SelectCategories')}>
          <Text style={styles.font}>Communicate With School</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'indianred' }]} onPress={() => nextScreen('CommunicationHistoryParent')}>
          <Text style={styles.font}>Communication History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[button, { backgroundColor: 'indigo' }]} onPress={() => nextScreen('ImageVideos')}>
          <Text style={styles.font}>Image/Video From School</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'maroon' }]} onPress={pickImage}>
          <Text style={styles.font}>Upload Student Pic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[button, { backgroundColor: 'olivedrab' }]}>
          <Text style={styles.font}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

let button = {
  justifyContent: 'space-between',
  width: '46%',
  height: '90%',
  margin: 5,
  padding: 20,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linen',
    width: "100%"
  },
  parallel: {
    flexDirection: 'row',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  font: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: 'cornsilk'
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
  headerLine: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 14,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
})

export default ParentMenu