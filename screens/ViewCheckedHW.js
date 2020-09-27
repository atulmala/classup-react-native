import React from 'react';
import {
  StyleSheet, View, Alert
} from 'react-native';
import { Text, Button, Spinner } from '@ui-kitten/components';
import ImageViewer from 'react-native-image-zoom-viewer';
var RNFS = require('react-native-fs');
import axios from 'axios';

const ViewCheckedHW = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { subject } = route.params;
  const { hwID } = route.params;
  const { uri } = route.params;

  const [loading, setLoading] = React.useState(false);

  const images = [{
    url: uri,
    props: {
    }
  }];

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.text} status='success' category='h6'>Please Preview</Text>
      </View>
    );
  };
  const HeaderRight = () => {
    return (
      <View style={styles.parallel}>
        {loading ? <View style={styles.parallel}>
          <Text style={styles.text} status='info'>Please wait...</Text>
          <View style={styles.loading}>
            <Spinner />
          </View>
        </View> :
          <View style={styles.headerMenu}>
            <Button style={styles.button} appearance='ghost' size='small' status='warning' onPress={retake}>
              Retake
              </Button>
            <Button style={styles.button} appearance='ghost' size='small' status='info' onPress={next}>
              Next
              </Button>
            <Button style={styles.button} appearance='ghost' size='small' status='success' onPress={done}>
              Done
              </Button>
          </View>}
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
    const filePath = uri.split('///').pop()
    RNFS.exists(filePath)
      .then((res) => {
        if (res) {
          RNFS.unlink(filePath)
            .then(() => console.log('FILE DELETED'))
        }
      });

    navigation.navigate('TakeHWPic', {
      serverIP: serverIP,
      userID: userID,
      studentID: studentID,
      hwID: hwID,
    });
  }

  const uploadHW = async () => {
    try {
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
      await axios.post(serverIP.concat("/homework/submit_hw_student/"), formData)
        .then(function (response) {
          console.log(response);
          setLoading(true);
          const filePath = uri.split('///').pop()
          RNFS.exists(filePath)
            .then((res) => {
              if (res) {
                RNFS.unlink(filePath)
                  .then(() => console.log('FILE DELETED'))
              }
            });

        });
    } catch (error) {
      console.error(error);
    }
  }

  const done = () => {
    uploadHW()
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to finish HW Upload process?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            navigation.navigate('HWListStudent', {
              serverIP: serverIP,
              userID: userID,
              studentID: studentID,
              subject: subject,
              hwID: hwID,
              comingFrom: "HWInstructions"
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  const next = () => {
    uploadHW();
    Alert.alert(
      "Next Page",
      "Please open the next page of your HW and focus camera.",
      [
        {
          text: "OK", onPress: () => {
            navigation.navigate('TakeHWPic', {
              serverIP: serverIP,
              userID: userID,
              studentID: studentID,
              subject: subject,
              hwID: hwID,
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerRight: () => <HeaderRight />,
      headerStyle: {
        backgroundColor: 'sienna',
      },
    });
  });

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={images}
        backgroundColor={'transparent'}
        loadingRender={renderSpinner}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  headerTitle: {
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 5
  },
  headerMenu: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'flex-end',
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

export default ViewCheckedHW;