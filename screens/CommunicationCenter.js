import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

const ParentMenu = ({ route, navigation }) => {

  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  let params = {
    serverIP: serverIP,
    schoolID: schoolID,
    userID: userID,
    userName: userName,
    comingFrom: "TeacherMenu"
  };

  const nextScreen = (screen) => {
    navigation.navigate(screen, params);
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Communication Center</Text>
        <Text style={styles.headerLine}>Teacher: {userName}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'darkkhaki',
      },
    });
  });

  return (
    <ScrollView style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'chocolate' }]} onPress={() => nextScreen('SelectClassTeacherCommunication')}>
          <Text style={styles.font}>Communicate With Parents</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'darkolivegreen' }]} onPress={() => nextScreen('ActivityGroups')}>
          <Text style={styles.font}>Activity Group Communication</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'goldenrod' }]} onPress={() => nextScreen('CommunicationHistoryTeacher')}>
          <Text style={styles.font}>Communication History</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'darkorchid' }]} onPress={() => nextScreen('Circulars')}>
          <Text style={styles.font}>Notices & Circulars</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'indianred' }]}>
          <Text style={styles.font}>Today's Arrangements</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.parallel}>
        <TouchableOpacity style={[button, { backgroundColor: 'maroon' }]}>
          <Text style={styles.font}>Time Table</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

let button = {
  justifyContent: 'space-between',
  width: '90%',
  height: '60%',
  margin: 5,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linen',
    width: "100%"
  },
  parallel: {
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  font: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: 'cornsilk'
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
        fontSize: 14,
      },
      android: {
        fontSize: 14,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
})

export default ParentMenu