import React, { useRef, useState } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Image, Alert,
  ActivityIndicator, ImageBackground
} from 'react-native';
import { Button, Layout } from '@ui-kitten/components';


const PreviewHW = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;
  const { uri } = route.params;

  const Header = () => {
    return (
        <View style={styles.parallel}>
          <Button style={styles.button} appearance='ghost' size='large' status='warning'>
            Retake
          </Button>
          <Button style={styles.button} appearance='ghost' size='large' status='info'>
            Next
          </Button>
          <Button style={styles.button} appearance='ghost' size='large' status='success'>
            Done
          </Button>
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

  const image = { uri: uri };
  return (
    <React.Fragment>
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.image} />
      </View>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  parallel: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center'
  },
  button: {
    margin: 2,
  },
});

export default PreviewHW;