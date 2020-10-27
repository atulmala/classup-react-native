import React from 'react';
import {
  StyleSheet, View, Alert
} from 'react-native';
import { Text, Button, Spinner } from '@ui-kitten/components';
import ImageViewer from 'react-native-image-zoom-viewer';
var RNFS = require('react-native-fs');

const ViewCheckedHW = ({ route, navigation }) => {
  const { images } = route.params;


  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.text} status='success' category='h6'>Swipe Left/Right</Text>
      </View>
    );
  };
  
  const renderSpinner = () => {
    return (
      <View style={styles.loading}>
        <Spinner />
      </View>
    )
  }  

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'darkslateblue',
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
  text: {
    fontSize: 18,
    fontFamily: 'Verdana',
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