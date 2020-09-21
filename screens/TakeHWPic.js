import { setStatusBarTranslucent } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Spinner } from '@ui-kitten/components';
import { RNCamera } from 'react-native-camera';

const TakeHWPic = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;

  const [takingPic, isTakingPic] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = React.useState(false);

  const CameraIcon = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={require('../assets/camera.png')}
            style={{
              width: 35,
              height: 35,
              borderRadius: 40 / 2,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const myCamera = useRef();
  const renderCamera = () => (
    <RNCamera
      ref={myCamera}
      captureAudio={false}
      style={{ flex: 1 }}
      type={RNCamera.Constants.Type.back}
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel'
      }}>
    </RNCamera >
  )

  const renderLoading = () => (
    <View style={styles.loading}>
      <Spinner />
    </View>
  )

  takePicture = async () => {
    if (myCamera.current && !takingPic) {
      let options = {
        quality: 0.5,
        skipProcessing: true,
        orientation: "portrait",
        base64: false
      };

      isTakingPic(true);

      try {
        setLoading(false);
        setData(await myCamera.current.takePictureAsync(options));
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        isTakingPic(false);
        setLoading(false);
        console.log("data = ", data);
        if (data != null) {
          navigation.navigate('PreviewHW', {
            serverIP: serverIP,
            userID: userID,
            studentID: studentID,
            hwID: hwID,
            uri: data.uri
          });
        }
        else  {
          Alert.alert('Error', 'Failed to take picture: Please try again');
        }
      }
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CameraIcon onPress={takePicture} />,
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
    });
  });

  return loading ? renderLoading() : renderCamera();

}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: 4,
    marginRight: 4,
    marginTop: 10,
    marginBottom: 2,
  },
  text: {
    margin: 2,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TakeHWPic;