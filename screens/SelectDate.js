import _ from 'lodash';
import React from 'react';
import { StyleSheet, View, ScrollView, } from 'react-native';
import { Datepicker, Layout, Text, Button, Icon } from '@ui-kitten/components';

const calendarIcon = (props) => (
  <Icon {...props} name='calendar' />
);

const SelectDate = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;

  const [date, setDate] = React.useState(new Date());

  const showAttendance = () => {
    const splitDate = date.toLocaleDateString().split("/");
    const selectedDay = splitDate[1];
    const selectedMonth = splitDate[0];
    const selectedYear = splitDate[2];

    navigation.navigate('AttendanceSummarySchool', {
      serverIP: serverIP,
      schoolID: schoolID,
      userID: userID,
      userName: userName,
      date: selectedDay,
      month: selectedMonth,
      year: selectedYear,
      comingFrom: "SelectDate"
    });
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText} status='warning' >Select Date</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#653594',
      },
    });
  });

  return (
    <Layout style={styles.container} level='1'>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}>
        <Layout
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.text} category='s1' status='info'>
            Select date:
          </Text>
          <Datepicker
            style={styles.select}
            accessoryRight={calendarIcon}
            date={date}
            onSelect={nextDate => setDate(nextDate)}
          />
        </Layout>
        <Layout style={styles.verticalSpace} />
              <Layout style={styles.buttonContainer}>
                <Button style={styles.button} appearance='outline' status='info' onPress={showAttendance} >
                  {"Show Attendance Summary"}
                </Button>
              </Layout>
      </ScrollView >

    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  select: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center"
  },
  button: {
    margin: 2,
    width: "70%"
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
 
  verticalSpace: {
    marginTop: 15
  },
  scrollContentContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },
});

export default SelectDate;
