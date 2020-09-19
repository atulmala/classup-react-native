import React, { PureComponent, useRef, useEffect } from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const TakeHWPic = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [takingPic, isTakingPic] = useState(false);
  var [wardList] = useState([]);

  const myCamera = useRef();

  const Camera = () => {
    return (
      <RNCamera
        inputRef={myCamera}
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
      let options = {
        quality: 0.85,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      isTakingPic(true);

      try {
        const data = await myCamera.takePictureAsync(options);
        Alert.alert('Success', JSON.stringify(data));
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        isTakingPic(false);
      }

    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
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
    backgroundColor: '#FFF',
    elevation: 6,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Verdana'
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    fontStyle: 'italic',
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 10,
    borderColor: 'black'
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