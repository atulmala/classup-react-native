import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import TeacherMenu from './screens/TeacherMenu';
import ParentMenu from './screens/ParentMenu';
import AdminMenu from './screens/AdminMenu';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherMenu" component={TeacherMenu} />
        <Stack.Screen name="ParentMenu" component={ParentMenu} />
        <Stack.Screen name="AdminMenu" component={AdminMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
export {Stack};