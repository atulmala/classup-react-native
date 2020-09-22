import React from 'react';
import {
  StyleSheet, View, Alert0
} from 'react-native';
import { Button, Spinner } from '@ui-kitten/components';
import ImageViewer from 'react-native-image-zoom-viewer';
var RNFS = require('react-native-fs');
import axios from 'axios';

const PreviewHW = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;
  const { uri } = route.params;


  console.log("uri inside PreviewHW = ", uri);
  const images = [{
    url: uri,


    // You can pass props to <Image />.
    props: {
      // headers: ...
    }

  }];

  const Header = () => {
    return (
      <View style={styles.parallel}>
        <Button style={styles.button} appearance='ghost' size='large' status='warning' onPress={retake}>
          Retake
          </Button>
        <Button style={styles.button} appearance='ghost' size='large' status='info' onPress={next}>
          Next
          </Button>
        <Button style={styles.button} appearance='ghost' size='large' status='success'>
          Done
          </Button>
      </View>
    )
  }

  const renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <Spinner />
      </View>
    )
  }

  const retake = () => {
    const filePath = uri.split('///').pop()  // removes leading file:///

    RNFS.exists(filePath)
      .then((res) => {
        if (res) {
          RNFS.unlink(filePath)
            .then(() => console.log('FILE DELETED'))
        }
      })
    navigation.navigate('TakeHWPic', {
      serverIP: serverIP,
      userID: userID,
      studentID: studentID,
      hwID: hwID,
    });
  }

  const next = () => {
    let formData = new FormData();
    formData.append("hw_id", hwID);
    formData.append("student_id", studentID);
    const split = uri.split('/');
    const name = split.pop();
    formData.append("file",
      {
        uri: uri,
        type: 'image/jpeg',
        name: name
      });

    try {
      axios.post(serverIP.concat("/homework/submit_hw_student/"), formData)
        .then(function (response) {
          console.log(response);
          Alert.alert(
            "HW Uploaded",
            "Home Work Uploaded to Server.",
            [
              {
                text: "OK", onPress: () => {
                  navigation.navigate('TakeHWPic', {
                    serverIP: serverIP,
                    userID: userID,
                    studentID: studentID,
                    hwID: hwID,
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


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Header />,
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
    });
  });

  return (
    <View style={styles.container}>
      <ImageViewer imageUrls={images} backgroundColor={'transparent'} loadingRender={renderSpinner} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  parallel: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
  },
  text: {
    margin: 2,
  },
  button: {
    margin: 2,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PreviewHW;