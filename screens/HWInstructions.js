import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Text } from '@ui-kitten/components';


const HWInstructions = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { hwID } = route.params;
  const { subject } = route.params;

  const RightArrow = ({ onPress }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={require('../assets/right_arrow.png')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 40 / 2,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  startCamera = async () => {
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to start HW Upload process?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            navigation.navigate('TakeHWPic', {
              serverIP: serverIP,
              userID: userID,
              studentID: studentID,
              subject: subject,
              hwID: hwID,
              comingFrom: "HWInstructions"
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <RightArrow onPress={startCamera} />,
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
    });
  });
  
  return (
    <React.Fragment>
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
        <Text style={styles.text} category='s2'>9. Click on the Right Arrow Icon Top Right to start upload HW</Text>
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