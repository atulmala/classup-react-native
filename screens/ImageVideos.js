import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, ActivityIndicator, FlatList, Text, TouchableOpacity } from 'react-native';
import { Card } from '@ui-kitten/components';
import Hyperlink from 'react-native-hyperlink'

import axios from 'axios';

const ImageVideo = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userID } = route.params;
  const { userName } = route.params;
  const { studentID } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [imageList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/pic_share/get_pic_video_list_teacher/", studentID, "/");
    axios
      .get(url)
      .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];

          let image = {};
          image.index = i;
          image.id = res.id;

          let longDate = res.creation_date;
          let yyyymmdd = longDate.substring(0, 10);
          let splittedDate = yyyymmdd.split("-");
          image.date = splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[0];

          image.description = res.descrition;
          image.link = res.short_link;

          imageList.push(image);
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setLoading(false);
      });
  }, []);

  const HeaderTitle = () => {
    return (
      <Text style={styles.headerText}>Image Video from School</Text>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'lightcoral',
      },
    });
  });

  const renderItemHeader = (headerProps, image) => (
    <View style={styles.containerLine}>
      <View style={[styles.headerProps, styles.containerRow]}>
        <View style={styles.container_text}>
          <Text style={styles.baseText}>
            Date:
              <Text style={styles.innerText}> {image.date}</Text>
          </Text>
        </View>
      </View>
    </View>
  );

  const CustomRow = ({ title }) => {
    return (
      <Card
        style={styles.item}
        header={headerProps => renderItemHeader(headerProps, title)}
      >
        <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9', fontSize: 14, }}>
          <Text style={styles.messageText}>{title.link}</Text>
        </Hyperlink>
        <Hyperlink style={{ marginTop: 15 }} linkDefault={true} linkStyle={{ color: '#2980b9', fontSize: 14, textDecorationLine: 'underline', }}>
          <Text style={styles.messageText}>{title.description}</Text>
        </Hyperlink>
      </Card>)
  };

  const CustomListview = ({ itemList }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow
            title={item}
            index={item.index}
          />}
        />
      </View>
    )
  };

  return (
    <View style={styles.container}>
      {isLoading ? <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0097A7'/>
      </View> : (
          <CustomListview
            itemList={imageList}
          />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blanchedalmond',
  },
  headerProps: {
    margin: 2,
  },
  item: {
    marginVertical: 1,
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 18,
      },
      android: {
        fontSize: 18,
      }
    }),
    fontWeight: 'bold',
    color: 'white',
  },
  containerLine: {
    flex: 1,
    paddingLeft: 12,
    marginRight: 4,
    elevation: 6,
  },
  container_text: {
    flex: 1,
  },
  baseText: {
    ...Platform.select({
      ios: {
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    marginBottom: 4,
    fontFamily: 'verdana',
    color: 'mediumslateblue',
  },
  innerText: {
    ...Platform.select({
      ios: {
        fontFamily: 'verdana',
        fontSize: 14,
      },
      android: {
        fontFamily: 'sans-serif',
        fontSize: 16,
      }
    }),
    fontWeight: 'bold',
    color: 'mediumblue',
  },
  messageText: {
    ...Platform.select({
      ios: {
        fontFamily: 'verdana',
        fontSize: 14,
      },
      android: {
        fontFamily: 'sans-serif',
        fontSize: 16,
      }
    }),
    marginLeft: -10,
    marginTop: -10,
    fontWeight: '400',
    color: 'darkslateblue',
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

export default ImageVideo;