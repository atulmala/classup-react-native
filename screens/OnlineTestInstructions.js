import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Size } from '@ui-kitten/components/devsupport';


const OnlineTestInstructions = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { testID } = route.params;
  const { studentID } = route.params;
  const { subject } = route.params;

  startTest = () => {
    Alert.alert(
      "Please Confirm ",
      "Are You sure you want to start Online Test?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            navigation.navigate('OnlineTest', {
              serverIP: serverIP,
              userID: userID,
              studentID: studentID,
              testID: testID,
              subject: subject,
              comingFrom: "HWInstructions"
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Instructions for Online Test </Text>
        <Text style={styles.headerLine}>Pl read carefully before starting Test </Text>
      </View>
    );
  };
  const RightArrow = ({  }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={startTest}>
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
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerRight: () => <RightArrow  />,
      headerStyle: {
        backgroundColor: 'darkgoldenrod',
      },
    });
  });
  
  return (
    <React.Fragment>
      <View style={styles.row}>
        <Text style={styles.text} category='h4' status='warning'>1. Most Important:</Text>
        <Text style={styles.text} category='h6' status='danger'>You have only one attempt for this Test</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='h6'>2. Once the test is started your attempt will be counted</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='h6'>3. Do Not press the Back button during the test</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='h6'>4. Do not tilt or rotate the phone during the test</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='h6'>5. Do not attend to any phone call during the test.</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text} category='h6'>6. If you are ready, Click Green Arrow on top</Text>
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
  headerLine: {
    ...Platform.select({
      ios: {
        fontSize: 12,
      },
      android: {
        fontSize: 12,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
  text: {
    margin: 2,
    fontFamily: 'verdana',
    fontSize: 16
  },
});

export default OnlineTestInstructions;