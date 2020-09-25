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
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;
  const { fetchPage } = route.params;

  const [isLoading, setLoading] = useState(true);
  var uri = "https://classup2.s3.amazonaws.com/media/prod/homework/0e91ad75-3dd5-458f-a043-543f140007ca.jpg";
  const hwPages = useState([]);

  const images = [{
    url: uri,
    props: {
    }
  }];

  useEffect(() => {
    let url = serverIP.concat("/homework/get_hw_pages/", hwID, "/", studentID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          hwPages.push(response.data[i].location);
        }
        console.log("hwPages = ", hwPages);
        RNFetchBlob
          .config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            fileCache: true,
          })
          .fetch('GET', hwPages[fetchPage + 2], {
            //some headers ..
          })
          .then((res) => {
            // the temp file path
            console.log('The file saved to ', res.path());
            PhotoEditor.Edit({
              path: res.path(),
              hiddenControls: ['save', 'share', 'sticker'],
              colors: ['#ff0000', '#008000'],
              onDone: (result) => {
                // Note: the path of file saved after editing is different than the file opened. 
                console.log('on done', res.path);
                console.log('on done result', result); // use this path to preview the saved image or overwrite the original image.
                // eg: result --> /storage/emulated/0/Pictures/PhotoEditorSDK/IMG_20200813_130958.jpg 
              },
              onCancel: () => {
                console.log('on cancel');
              },
            });
          });

        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  });

  const done = () => {
    console.log("onDone");
  };

  const cancel = () => {
    console.log("onCancel");
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.text} status='success' category='h6'>HW Check</Text>
      </View>
    );
  };
  const HeaderRight = () => {
    return (
      <View style={styles.parallel}>
        <View style={styles.headerMenu}>
          <Button style={styles.button} appearance='ghost' size='small' status='warning' >
            Retake
            </Button>
          <Button style={styles.button} appearance='ghost' size='small' status='info' >
            Next
            </Button>
          <Button style={styles.button} appearance='ghost' size='small' status='success' >
            Done
            </Button>
        </View>
      </View>
    )
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckHW;