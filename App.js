import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import TeacherMenu from './screens/TeacherMenu';
import ParentMenu from './screens/ParentMenu';
import AdminMenu from './screens/AdminMenu';
import SelectClass from './screens/SelectClass';
import TakeAttendance from './screens/TakeAttendance';
import HWListTeacher from './screens/HWListTeacher';

const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{
          headerStyle: {
            backgroundColor: 'darkcyan',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRightContainerStyle:  {
            marginRight: 5
          },
          
        }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
            headerShown: false,
            title: 'Login'
          }} />
          <Stack.Screen name="TeacherMenu" component={TeacherMenu} options={{
            title: 'Teacher Menu',
            headerLeft: null
          }} />
          <Stack.Screen name="ParentMenu" component={ParentMenu} options={{
            title: 'Parent Menu',
          }} />
          <Stack.Screen name="AdminMenu" component={AdminMenu}
            options={{
              title: 'Admin Menu',
            }} />
          <Stack.Screen name="SelectClass" component={SelectClass} options={{
            title: 'Provide Details',
          }} />
          <Stack.Screen name="TakeAttendance" component={TakeAttendance} options={{
            title: 'Take Attendance'
          }} />
          <Stack.Screen name="HWListTeacher" component={HWListTeacher} options={{
            title: 'HW List',
          }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
export { Stack };