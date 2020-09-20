import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';

import { RNCamera } from 'react-native-camera';


const TakeHWPic = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;

  const [takingPic, isTakingPic] = useState(false);
  const [uri, SetUri] = useState("");
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

  takePicture = async () => {
    if (myCamera && !takingPic) {
      let options = {
        quality: 0.5,
        fixOrientation: true,
        forceUpOrientation: true,
        skipProcessing: true,
        orientation: "portrait",
      };

      isTakingPic(true);

      try { 
        setLoading(false);
        const data = await myCamera.current.takePictureAsync(options);
        setLoading(false);
        SetUri(data.uri);
        if (uri == "")  {
          Alert.alert("Some error in taking picture. Pl take again");
          setLoading(false);
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        isTakingPic(false);
        setLoading(false);
        if (uri != "")  {
          navigation.navigate('PreviewHW', {
            serverIP: serverIP,
            userID: userID,
            studentID: studentID,
            hwID: hwID,
            uri: uri
          });
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
  
  const myCamera = useRef();
  return (
    <React.Fragment>
      {loading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
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
      </RNCamera >)}
    </React.Fragment>
  )
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

export default TakeHWPic;