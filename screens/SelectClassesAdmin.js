import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Divider, List, ListItem, Icon } from '@ui-kitten/components';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const SelectClassesAdmin = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { comingFrom } = route.params;


  const [classList] = useState([]);
  const [selectedClasses] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [checked, setChecked] = useState(0);

  const getClassList = () => {
    return axios.get(serverIP.concat("/academics/class_list/", schoolID, "/"));
  };

  useEffect(() => {
    axios.all([getClassList()]).then(
      axios.spread(function (classes) {
        for (i = 0; i < classes.data.length; i++) {
          let theClass = {};
          theClass.class = classes.data[i].standard;
          theClass.selected = false;
          classList.push(theClass);
        }

        let teachers = {};
        teachers.class = "Teachers";
        teachers.selected = false;
        classList.push(teachers);

        let staff = {};
        staff.class = "Staff";
        staff.selected = false;
        classList.push(staff);

        setLoading(false);
      })
    );
  }, []);

  const renderItemIcon = (props) => {
    return (
      <Icon {...props} name='checkmark-circle-2-outline'></Icon>
    );
  };

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.class} `}
      accessoryRight={item.selected ? renderItemIcon : null}
      onPress={() => {
        setChecked(Math.floor(Math.random() * 1001));
        classList[index].selected = !classList[index].selected;

        if (classList[index].selected) {
          selectedClasses.push(classList[index].class);
        }
        else {
          let idx = selectedClasses.indexOf(classList[index].class);
          if (idx > -1) {
            selectedClasses.splice(idx, 1);
          }
        }
      }}
    />
  );

  const selectAll = () => {
    setLoading(true);
    setSelectedAll(!selectedAll);
    selectedClasses.length = 0;
    classList.map(item => {
      if (selectedAll)  {
        item.selected = true;
        selectedClasses.push(item.class);
      }
      else  {
        item.selected = false;
      }
    })
    console.log("selectedClasses = ", selectedClasses);

    setLoading(false);
  }

  const composeMessage = () => {
    if (selectedClasses.length == 0) {
      alert("Please select recepients");
      return
    }
    else {
      navigation.navigate('ComposeMessageAdmin', {
        'serverIP': serverIP,
        'schoolID': schoolID,
        'userID': userID,
        'userName': userName,
        'recepients': selectedClasses,
      });
    }

  }

  const HeaderRight = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={selectAll}>
          <Image
            source={require('../assets/select_all.png')}
            style={{
              width: 25,
              height: 25,
              marginTop: 4,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={composeMessage}>
          <Image
            source={require('../assets/compose_message.png')}
            style={{
              width: 30,
              height: 30,
              marginTop: 4,
              marginLeft: 15,
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const HeaderTitle = () => {
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText} status='warning' >Select Classes</Text>
      </View>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#ff9800',
      },
      headerRight: () => <HeaderRight />
    });
  });

  return (
    <View style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
      </View> : (
          <List
            style={styles.title}
            data={classList}
            keyExtractor={(item) => item.name}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem}
          />)}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SelectClassesAdmin;
