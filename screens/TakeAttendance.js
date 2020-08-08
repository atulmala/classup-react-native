import React from 'react';
import { useState } from 'react';

const TakeAttendance = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolId } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { selectedDay } = route.params;
  const { selectedMonth } = route.params;
  const { selectedYear } = route.params;
  const { selectedClass } = route.params;
  const { selectedSection } = route.params;
  const { selectedSubject } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.parallel}>
        <TouchableOpacity style={styles.btn1} onPress={_gotoSelectClass}>
          <Text style={styles.font}>Take/Update Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TakeAttendance;