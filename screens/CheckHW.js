import React, { useEffect, useState } from 'react';;
import {
  StyleSheet, View, Alert, PermissionsAndroid, Image, Platform,
} from 'react-native';
import { Text, Button, Spinner } from '@ui-kitten/components';
var RNFS = require('react-native-fs');
import ImageViewer from 'react-native-image-zoom-viewer';
import PhotoEditor from 'react-native-photo-editor';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

const CheckHW = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;
  const { uri } = route.params;
  const { sequence } = route.params;

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    RNFetchBlob
      .config({
        fileCache: true,
      })
      .fetch('GET', uri + "?" + (new Date()).getTime(), {
      })
      .then((res) => {
        // the temp file path
        console.log('The file saved to ', res.path());
        setLoading(false);
        PhotoEditor.Edit({
          path: res.path(),
          hiddenControls: ['save', 'share', 'sticker'],
          colors: ['#ff0000', '#008000'],

          onDone: (result) => {
            setLoading(true);
            const split = uri.split('/');
            const fileName = split.pop();
            let url = serverIP.concat("/homework/check_hw_teacher/");
            RNFetchBlob.fetch('POST', url, {
              'Content-Type': 'multipart/form-data',
            }, [
              {
                name: "file",
                filename: fileName,
                data: RNFetchBlob.wrap(res.path())
              },

              { name: 'hw_id', data: String(hwID) },
              { name: 'student_id', data: String(studentID) },
              { name: 'teacher', data: String(userID) },
              { name: 'sequence', data: String(sequence) },

            ]).then((resp) => {
              navigation.replace('HWPagesList', {
                serverIP: serverIP,
                schoolID: schoolID,
                userName: userName,
                userID: userID,
                studentID: studentID,
                hwID: hwID,
              });
            }).catch((err) => {
              // ...
            });
          },

          onCancel: () => {
            setLoading(true);
            navigation.navigate('HWPagesList', {
              serverIP: serverIP,
              schoolID: schoolID,
              userName: userName,
              userID: userID,
              studentID: studentID,
              hwID: hwID,
            });
          },
        });
      });
  }, []);

  const HeaderTitle = () => {
    return (
      <View style={styles.parallel}>
        {isLoading ? <View style={styles.parallel}>
          <View style={styles.loading}>
            <Spinner />
          </View>
        </View> :
          <View style={styles.headerMenu} />}
      </View>
    )
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerStyle: {
        backgroundColor: 'sienna',
      },
    });
  });

  const renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <Spinner />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isLoading ? renderSpinner : <View />}
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
    marginTop: 20,
    paddingTop: 5,
    paddingBottom: 5,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckHW;