import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Spinner, Text } from '@ui-kitten/components';
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

  takePicture = async () => {
    if (myCamera.current && !takingPic) {
      let options = {
        quality: 0.2,
        skipProcessing: true,
        fixOrientation: true,
        forceUpOrientation: true,
        orientation: "portrait",
        base64: false
      };

      isTakingPic(true);

      try {
        setLoading(true);
        setData(await myCamera.current.takePictureAsync(options));
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        isTakingPic(false);
        setLoading(false);
        if (data != null) {
          navigation.navigate('PreviewHW', {
            serverIP: serverIP,
            userID: userID,
            studentID: studentID,
            hwID: hwID,
            uri: data.uri
          });
        }
        else {
          Alert.alert('Error', 'Failed to take picture: Please try again');
        }
      }
    }
  };
  const Header = () => {
    return (
      <View style={styles.parallel}>
        {loading ? <View style={styles.parallel}>
        <Text style={styles.text} status='info'>Please wait...</Text>
          <View style={styles.loading}>
            <Spinner />
          </View>
          <CameraIcon onPress={takePicture} />
        </View> :
          <CameraIcon onPress={takePicture} />}
      </View>
    )
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Header />,
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
    });
  });

  return renderCamera();

}

const styles = StyleSheet.create({
  parallel: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
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