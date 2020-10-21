import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, ActivityIndicator, Linking, FlatList, Text } from 'react-native';

import { Card } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';

import axios from 'axios';

const LectureListStudent = ({ route, navigation }) => {
  const { serverIP } = route.params;
  const { schoolID } = route.params;
  const { userName } = route.params;
  const { userID } = route.params;
  const { studentID } = route.params;
  const { subject } = route.params;

  const [isLoading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [lectureList] = useState([]);

  useEffect(() => {
    let url = serverIP.concat("/lectures/get_student_lectures/", studentID, "?subject=", subject);
    axios
      .get(url)
      .then(function (response) {
        lectureList.length = 0;
        for (var i = 0; i < response.data.length; i++) {
          let res = response.data[i];

          let lecture = {};
          lecture.index = i;
          lecture.id = res.id;

          let longDate = res.creation_date;
          let yyyymmdd = longDate.substring(0, 10);
          let splittedDate = yyyymmdd.split("-");
          lecture.creation_date = splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[0];

          lecture.teacher = res.teacher;
          lecture.subject = res.subject;
          lecture.the_class = res.the_class;
          lecture.section = res.section;
          lecture.topic = res.topic;
          lecture.youtube_link = res.youtube_link;
          lecture.doc_link = res.doc_file;
          lecture.pdf_link = res.pdf_link;

          lectureList.push(lecture);
        }
        console.log(lectureList);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setLoading(false);
      });
  }, [isFocused]);

  const HeaderTitle = () => {
    return (
      <Text style={styles.headerText}>Lecture List for { subject}</Text>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle />,
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'olivedrab',
      },
    });
  });

  const openVideo = (title) => {
    Linking.openURL(title.youtube_link)
  }

  const openDoc = (title) => {
    Linking.openURL(title.doc_link)
  }

  const renderItemHeader = (headerProps, lecture) => (
    <View style={styles.containerLine}>
      <View style={[headerProps, styles.containerRow]}>
        <View style={styles.container_text}>
          <Text style={styles.baseText}>
            Date:
              <Text style={styles.innerText}> {lecture.creation_date}</Text>
          </Text>
        </View>
        <View style={styles.container_text}>
          <Text style={styles.baseText}>
            Class:
              <Text style={styles.innerText}> {lecture.the_class}</Text>
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
        <Text style={styles.baseText}>
          Subject:
              <Text style={styles.innerText}> {title.teacher}</Text>
        </Text>
        <Text style={styles.baseText}>
          Topic:
              <Text style={styles.innerTextDescription}> {title.topic}</Text>
        </Text>
        <Text style={styles.baseText}>
          Video Link:
              <Text style={styles.hyperlink} onPress={() => openVideo(title)}> {title.youtube_link}</Text>
        </Text>
        {title.doc_link != null &&
          <Text style={styles.baseText}>
            Doc Link:
              <Text style={styles.hyperlink} onPress={() => openDoc(title)}> Tap here to View</Text>
          </Text>}
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
        <ActivityIndicator size='large' />
      </View> : (
          <CustomListview
            itemList={lectureList}
          />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'cornsilk',
  },
  headerProps: {
    flex: 3,
    margin: 2,
    padding: 2,
  },
  footerContainer: {
    padding: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  footerControl: {
    marginHorizontal: 2,
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
    marginTop: 0,
    fontWeight: 'bold',
    color: 'white',
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
  },
  containerLine: {
    flex: 1,
    paddingLeft: 12,
    marginLeft: 12,
    marginRight: 4,
    elevation: 6,
  },
  tinyLogo: {
    margin: 12,
    width: 24,
    height: 24,
  },
  container_text: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
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
    fontWeight: 'bold',
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

    color: 'mediumblue',
  },
  innerTextDescription: {
    ...Platform.select({
      ios: {
        fontFamily: 'ArialMT',
        fontSize: 14,
      },
      android: {
        fontFamily: 'sans-serif-thin',
        fontSize: 16,
      }
    }),
    color: 'navy',
  },
  hyperlink: {
    ...Platform.select({
      ios: {
        fontFamily: 'Arial',
        fontSize: 14,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: 'dodgerblue',
    margin: 4
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

export default LectureListStudent;