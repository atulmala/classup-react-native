import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Keyboard, KeyboardAvoidingView,
  FlatList, Switch, Image, Alert
} from 'react-native';

import {
  IndexPath, Datepicker, Layout, Select, CheckBox,
  Input, Button, SelectItem, Icon
} from '@ui-kitten/components';
import { useHeaderHeight } from '@react-navigation/stack';

import axios from 'axios';


const MarksEntry = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { exam } = route.params;
  const { testID } = route.params;
  const { theClass } = route.params;
  const { subject } = route.params;
  const { higherClass } = route.params;

  const [isLoading, setLoading] = useState(true);

  const [markList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/academics/get_test_marks_list/", testID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];
          let record = {};
          record.id = res.id;
          let rollNo = i + 1;
          let name = res.student;
          let fullName = rollNo + ". " + name;
          record.fullName = fullName;
          record.parent = res.parent;
          record.marks = res.marks_obtained;
          record.grade = res.grade;
          record.ptMarks = res.periodic_test_marks;
          record.multAssesMarks = res.multi_assess_marks;
          record.notebookMarks = res.notebook_marks;
          record.subEnrichMarks = res.sub_enrich_marks;
          record.pracMarks = higherClass ? res.prac_marks : 0;

          markList.push(record);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

  }, [schoolID]);

  const CustomRow = ({ title, index }) => {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
      <View style={styles.containerRow}>
        <View style={styles.container_text}>
          <Text style={styles.title}>
            {title.fullName}
          </Text>
        </View>
        <View style={styles.parallel}>
          <Input
            style={styles.select}
            status='primary'
            size='small'
            keyboardType="number-pad"
            label={evaProps => <Text {...evaProps}>Marks</Text>}
            onChangeText={text => setMaxMarks(text)}
          />
          <Input
            style={styles.select}
            status='success'
            size='small'
            keyboardType="decimal-pad"
            label={evaProps => <Text {...evaProps}>Grade</Text>}
            onChangeText={text => setPassingMarks(text)}
          />
          <Input
            style={styles.select}
            status='info'
            size='small'
            keyboardType="decimal-pad"
            label={evaProps => <Text {...evaProps}>Practical</Text>}
            onChangeText={text => setPassingMarks(text)}
          />
        </View>
        <View style={styles.parallel}>
          <Input
            style={styles.select}
            status='warning'
            size='small'
            keyboardType="number-pad"
            label={evaProps => <Text {...evaProps}>PA</Text>}
            onChangeText={text => setMaxMarks(text)}
          />
          <Input
            style={styles.select}
            status='danger'
            size='small'
            keyboardType="decimal-pad"
            label={evaProps => <Text {...evaProps}>Multi Ass</Text>}
            onChangeText={text => setPassingMarks(text)}
          />
          <Input
            style={styles.select}
            status='success'
            size='small'
            keyboardType="decimal-pad"
            label={evaProps => <Text {...evaProps}>Notebook</Text>}
            onChangeText={text => setPassingMarks(text)}
          />
          <Input
            style={styles.select}
            status='primary'
            size='small'
            keyboardType="decimal-pad"
            label={evaProps => <Text {...evaProps}>Sub Enrich</Text>}
            onChangeText={text => setPassingMarks(text)}
          />
        </View>
      </View>)
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow
            title={item}
            index={item.id}

          />}
        />
      </View>
    )
  };

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Marks Entry {exam.title}</Text>
        <Text style={styles.headerLine}>{theClass} {subject}</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'chocolate',
      },
      headerRight: () =>
        <View style={styles.parallel}>
          {!isLoading &&
            <TouchableOpacity style={styles.nextButton} onPress={() => processAttendance()}>
              <Text style={styles.nextText}>  Save  </Text>
            </TouchableOpacity>}
          {!isLoading &&
            <TouchableOpacity style={styles.nextButton} onPress={() => processAttendance()}>
              <Text style={styles.nextText}>Submit</Text>
            </TouchableOpacity>}
        </View>
    });
  });

  return (<KeyboardAvoidingView
    behavior={Platform.OS == "ios" ? "padding" : "height"}
    keyboardVerticalOffset={useHeaderHeight()}
    style={styles.container} >
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View> : (
          <CustomListview
            itemList={markList}
          />)}
    </View>
  </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 2,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  containerRow: {
    flex: 1,
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 10,
    backgroundColor: 'oldlace',
    elevation: 6,
  },
  title: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Verdana'
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 28,
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
        fontSize: 16,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
 
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88'
  },
  evaProps: {
    textShadowColor: "magenta",
    color: 'blue'
  },
  select: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  
  nextButton: {
    backgroundColor: 'lavenderblush',
    height: 25,
    margin: 10,
    padding: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextText: {
    fontSize: 12,
    color: 'indigo',
  }
});

export default MarksEntry;