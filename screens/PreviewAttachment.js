import React from 'react';
import { StyleSheet, View, Text, Platform, Dimensions } from 'react-native';
import { Spinner } from '@ui-kitten/components';
import ImageViewer from 'react-native-image-zoom-viewer';
import Pdf from 'react-native-pdf';
import { concat } from 'react-native-reanimated';
import {ProgressView} from "@react-native-community/progress-view";

var RNFS = require('react-native-fs');

const PreviewAttachment = ({ route, navigation }) => {
  const { type } = route.params;
  const { images } = route.params;
  const { source } = route.params;
  const { pdfName } = route.params;

  console.log("type = ", type);
  console.log("images = ", images);
  console.log("source = ", source);

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText} status='success' category='h6'>Preview</Text>
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
      {type != 'application/pdf' &&
        <ImageViewer
          imageUrls={images}
          backgroundColor={'transparent'}
          loadingRender={renderSpinner}
        />}
      {type == 'application/pdf' &&
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link presse: ${uri}`)
          }}
          style={styles.pdf} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 16,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PreviewAttachment;