import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Text } from '@ui-kitten/components';
import { RNCamera } from 'react-native-camera';


const HWInstructions = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;

  const [takingPic, isTakingPic] = useState(false);

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
  const Camera = () => {
    return (
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
    );
  };

  takePicture = async () => {
    if (myCamera && !takingPic) {
      console.log("camera = ", myCamera);
      let options = {
        quality: 0.85,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      isTakingPic(true);

      try { 
        const data = await myCamera.current.takePictureAsync(options);
        Alert.alert('Success', JSON.stringify(data));
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        isTakingPic(false);
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
  
  return (
    <React.Fragment>
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
      <View style={styles.row}>
        <Text style={styles.text} category='P1' status='warning'>1. Most Important:</Text>
        <Text style={styles.text} category='s2'>Keep the Resoultion of Camera Low</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2' status='info'>Pics taken in High resoultion will take too long to upload</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2'>2. Open the first page of homework</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2'>3. Focus the camera vertically above so that full page is covered</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2'>4. Click a clear pic of your HW Page. Ensure in preview its readable and complete page is appearing</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2'>5. If pic is unclear or any other issue Retake the the pic</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2'>6. Click Next Button</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2'>7. Open the next page of HW and repeat the above steps for each page</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2'>8. Click Finish when pics of all the HW pages are taken</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='s2'>9. Click on the Camera Icon Top Right to start upload HW</Text>
      </View>
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
});

export default HWInstructions;