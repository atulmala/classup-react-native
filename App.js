import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import LoginScreen from './screens/LoginScreen';
import TeacherMenu from './screens/TeacherMenu';
import ParentMenu from './screens/ParentMenu';
import AdminMenu from './screens/AdminMenu';
import SelectClass from './screens/SelectClass';
import TakeAttendance from './screens/TakeAttendance';
import HWListTeacher from './screens/HWListTeacher';
import CreateHW from './screens/CreateHW';
import HWSubmissions from './screens/HWSubmissions';
import SelectSubject from './screens/SelectSubject';
import SelectWard from './screens/SelectWard';
import HWListStudent from './screens/HWListStudent';
import HWInstructions from './screens/HWInstructions';
import TakeHWPic from './screens/TakeHWPic';
import PreviewHW from './screens/PreviewHW';
import CheckHW from './screens/CheckHW';
import HWPagesList from './screens/ HWPagesList';
import ViewCheckedHW from './screens/ViewCheckedHW';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <IconRegistry icons={EvaIconsPack} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{
          headerStyle: {
            backgroundColor: 'darkcyan',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRightContainerStyle: {
            marginRight: 5
          },
          headerBackTitleVisible: false,
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
          <Stack.Screen name="CreateHW" component={CreateHW} options={{
            title: 'Create HomeWork',
          }} />
          <Stack.Screen name="HWSubmissions" component={HWSubmissions} options={{
            title: 'HW Submissions',
          }} />
          <Stack.Screen name="SelectSubject" component={SelectSubject} options={{
            title: 'Select Subject',
          }} />
          <Stack.Screen name="SelectWard" component={SelectWard} options={{
            title: 'Select Ward',
          }} />
          <Stack.Screen name="HWListStudent" component={HWListStudent} options={{
            title: 'HW List',
          }} />
          <Stack.Screen name="HWInstructions" component={HWInstructions} options={{
            title: 'HW Instructions',
          }} />
          <Stack.Screen name="TakeHWPic" component={TakeHWPic} options={{
            title: 'Take Pic',
          }} />
          <Stack.Screen name="PreviewHW" component={PreviewHW} options={{
            title: ' ',
            headerLeft: null,
          }} />
          <Stack.Screen name="CheckHW" component={CheckHW} options={{
            title: ' ',
          }} />
          <Stack.Screen name="HWPagesList" component={HWPagesList} options={{
          }} />
          <Stack.Screen name="ViewCheckedHW" component={ViewCheckedHW} options={{

          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}
export default App;
export { Stack };