import React from 'react';
import { useState } from 'react';
import { StyleSheet, Button, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../Constants/colors';

const SelectClass = ({ route, navigation }) => {
  const { url } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    console.log(new Date(selectedDate));
    const currentDate = selectedDate || date;
    console.log("currentDate = ", currentDate);
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };


  var selectedDate = "";
  var selectedClass = "";
  var selectedSection = "";
  var selectedSubject = "";

  return (
    <View style={styles.container}>
      <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>

      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="spinner"
          maximumDate={new Date()}
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2dfdb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    fontSize: 18,
    color: "white"
  },

  spinnerTextStyle: {
    color: '#FFF'
  },
});

export default SelectClass;
