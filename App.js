import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import SplashScreen from 'react-native-splash-screen';


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
import TestExams from './screens/TestExams';
import SelectExam from './screens/SelectExam';
import ScheduleTest from './screens/ScheduleTest';
import TestList from './screens/TestList';
import MarksEntry from './screens/MarksEntry';
import SelectClassCoSchol from './screens/SelectClassCoSchol';
import CoScholastic from './screens/CoScholastic';
import OnlineTestToday from './screens/OnlineTestToday';
import OnlineTestInstructions from './screens/OnlineTestInstructions';
import OnlineTest from './screens/OnlineTest';
import UpcomingTests from './screens/UpcomingTests';
import ExamResult from './screens/ExamResult';
import LectureListTeacher from './screens/LectureListTeacher';
import CreateLecture from './screens/CreateLecture';
import SelectSubjectLectures from './screens/SelectSubjectLectures';
import LectureListStudent from './screens/LectureListStudent';
import CommunicationCenter from './screens/CommunicationCenter';
import SelectClassTeacherCommunication from './screens/SelectClassTeacherCommunication';
import SelectStudentsForMessage from './screens/SelectStudentsForMessage';
import ComposeMessageTeacher from './screens/ComposeMessageTeacher';
import PreviewAttachment from './screens/PreviewAttachment';
import SetSubjects from './screens/SetSubjects';
import SelectMonth from './screens/SelectMonth';
import AttendanceSummaryClass from './screens/AttendanceSummaryClass';
import AttendanceSummaryStudent from './screens/AttendanceSummaryStudent';
import CommunicationHistoryTeacher from './screens/CommunicationHistoryTeacher';
import RecepientList from './screens/RecepientList';
import CommunicationHistoryParent from './screens/CommunicationHistoryParent';
import Circulars from './screens/Circulars';
import SelectCategories from './screens/SelectCategories';
import ComposeMessageParent from './screens/ComposeMessageParent';
import ActivityGroups from './screens/ActivityGroups';
import ActivityMembers from './screens/ActivityMembers';
import ComposeMessageActivity from './screens/ComposeMessageActivity';
import ImageVideos from './screens/ImageVideos';
import SelectClassesAdmin from './screens/SelectClassesAdmin';
import ComposeMessageAdmin from './screens/ComposeMessageAdmin';
import SelectDate from './screens/SelectDate';
import AttendanceSummarySchool from './screens/AttendanceSummarySchool';
import AddTeacher from './screens/AddTeacher';
import TeachersList from './screens/TeachersList';
import UpdateTeacher from './screens/UpdateTeacher';
import SelectDateTeacherAttendance from './screens/SelectDateTeacherAttendance';
import TeacherAttendance from './screens/TeacherAttendance';
import SelectClassStudentUpdate from './screens/SelectClassStudentUpdate';
import StudentList from './screens/StudentList';
import UpdateStudent from './screens/UpdateStudent';
import ChangePassword from './screens/ChangePassword';

const Stack = createStackNavigator();

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);
  
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <IconRegistry icons={EvaIconsPack} />
      <StatusBar barStyle='light-content' />
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
          <Stack.Screen name="ParentMenu" component={ParentMenu} options={{}} />
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
            headerLeft: null,
          }} />
          <Stack.Screen name="ViewCheckedHW" component={ViewCheckedHW} options={{
          }} />
          <Stack.Screen name="TestExams" component={TestExams} options={{
            title: 'Tests & Exams'
          }} />
          <Stack.Screen name="SelectExam" component={SelectExam} options={{
            title: 'Please Select an Exam'
          }} />
          <Stack.Screen name="ScheduleTest" component={ScheduleTest} options={{
            title: 'Schedule Test'
          }} />
          <Stack.Screen name="TestList" component={TestList} />
          <Stack.Screen name="MarksEntry" component={MarksEntry} />
          <Stack.Screen name="SelectClassCoSchol" component={SelectClassCoSchol} />
          <Stack.Screen name="CoScholastic" component={CoScholastic} />
          <Stack.Screen name="OnlineTestToday" component={OnlineTestToday} />
          <Stack.Screen name="OnlineTestInstructions" component={OnlineTestInstructions} />
          <Stack.Screen name="OnlineTest" component={OnlineTest} />
          <Stack.Screen name="UpcomingTests" component={UpcomingTests} />
          <Stack.Screen name="ExamResult" component={ExamResult} />
          <Stack.Screen name="LectureListTeacher" component={LectureListTeacher} />
          <Stack.Screen name="CreateLecture" component={CreateLecture} />
          <Stack.Screen name="SelectSubjectLectures" component={SelectSubjectLectures} />
          <Stack.Screen name="LectureListStudent" component={LectureListStudent} />
          <Stack.Screen name="CommunicationCenter" component={CommunicationCenter} />
          <Stack.Screen name="SelectClassTeacherCommunication" component={SelectClassTeacherCommunication}/>
          <Stack.Screen name="SelectStudentsForMessage" component={SelectStudentsForMessage} />
          <Stack.Screen name="ComposeMessageTeacher" component={ComposeMessageTeacher} />
          <Stack.Screen name="PreviewAttachment" component={PreviewAttachment} />
          <Stack.Screen name="SetSubjects" component={SetSubjects} />
          <Stack.Screen name="SelectMonth" component={SelectMonth} />
          <Stack.Screen name="AttendanceSummaryClass" component={AttendanceSummaryClass} />
          <Stack.Screen name="AttendanceSummaryStudent" component={AttendanceSummaryStudent} />
          <Stack.Screen name="CommunicationHistoryTeacher" component={CommunicationHistoryTeacher} />
          <Stack.Screen name="RecepientList" component={RecepientList} />
          <Stack.Screen name="CommunicationHistoryParent" component={CommunicationHistoryParent} />
          <Stack.Screen name="Circulars" component={Circulars} />
          <Stack.Screen name="SelectCategories" component={SelectCategories} />
          <Stack.Screen name="ComposeMessageParent" component={ComposeMessageParent} />
          <Stack.Screen name="ActivityGroups" component={ActivityGroups} />
          <Stack.Screen name="ActivityMembers" component={ActivityMembers} />
          <Stack.Screen name="ComposeMessageActivity" component={ComposeMessageActivity} />
          <Stack.Screen name="ImageVideos" component={ImageVideos} />
          <Stack.Screen name="SelectClassesAdmin" component={SelectClassesAdmin} />
          <Stack.Screen name="ComposeMessageAdmin" component={ComposeMessageAdmin} />
          <Stack.Screen name="SelectDate" component={SelectDate} />
          <Stack.Screen name="AttendanceSummarySchool" component={AttendanceSummarySchool} />
          <Stack.Screen name="AddTeacher" component={AddTeacher} />
          <Stack.Screen name="TeachersList" component={TeachersList} />
          <Stack.Screen name="UpdateTeacher" component={UpdateTeacher} />
          <Stack.Screen name="SelectDateTeacherAttendance" component={SelectDateTeacherAttendance} />
          <Stack.Screen name="TeacherAttendance" component={TeacherAttendance} />
          <Stack.Screen name="SelectClassStudentUpdate" component={SelectClassStudentUpdate} />
          <Stack.Screen name="StudentList" component={StudentList} />
          <Stack.Screen name="UpdateStudent" component={UpdateStudent} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}
export default App;
export { Stack };