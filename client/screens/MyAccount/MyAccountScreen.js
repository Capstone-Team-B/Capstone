import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { getDatabase, ref, child, get } from 'firebase/database';
import SignOutBtn from './SignOutBtn';
import { useNavigation } from '@react-navigation/native';

const dummyUser = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '555-555-1234',
  email: 'johndoe@user.com',
  location: 'New York, NY, USA',
};

const MyAccountScreen = ({ route }) => {
  const [user, setUser] = useState(dummyUser);
  console.log(route);
  // const {uid} = route.params

  // useEffect(() => {
  //   const dbRef = ref(getDatabase());
  //   get(child(dbRef, `users/${uid}`))
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
  //         console.log("this is the data from the database -->", snapshot.val());
  //         setUser(snapshot.val());
  //       } else {
  //         console.log("No data available");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // console.log("userId -->", uid);
  // console.log("user -->", user);
  const navigation = useNavigation();

  const handlePressCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const handlePressEditAccount = () => {
    navigation.navigate('EditAccountScreen', user);
  };

  const handlePressEditPrefs = () => {
    navigation.navigate('EditPrefsScreen', user);
  };

  const handlePressViewArchive = () => {
    navigation.navigate('ViewArchiveScreen', user);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.createEvent}>
        <Pressable style={styles.createEvent} onPress={handlePressCreateEvent}>
          <Feather name="star" size={60} />
          <Text style={styles.createEventTitle}>Create an event</Text>
        </Pressable>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Account details</Text>
        <Pressable onPress={handlePressEditAccount}>
          <Feather name="edit" size={20} />
        </Pressable>
      </View>
      <View style={styles.section}>
        <View>
          <Text>First name: {user.firstName ? user.firstName : 'no data'}</Text>
          <Text>Last name: {user.lastName ? user.lastName : 'no data'}</Text>
          <Text>Password: {user.password ? user.password : 'no data'}</Text>
          <Text>Phone: {user.phoneNumber ? user.phoneNumber : 'no data'}</Text>
          <Text>Email: {user.email ? user.email : 'no data'}</Text>
          <Text>Location: {user.location ? user.location : 'no data'}</Text>
        </View>
        <View>
          <Image
            style={styles.profilePic}
            source={{
              uri: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-3091504.jpg',
            }}
          />
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Guest Preferences</Text>
        <Pressable onPress={handlePressEditPrefs}>
          <Feather name="edit" size={20} />
        </Pressable>
      </View>
      <View style={styles.section}>
        <View>
          <Text>Accessibility</Text>
          <Text>Dietary restrictions</Text>
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Archive</Text>
        <Pressable onPress={handlePressViewArchive}>
          <Feather name="rewind" size={20} />
        </Pressable>
      </View>
      <View style={styles.section}>
        <View>
          <Text>Past event's I've attended/hosted</Text>
        </View>
      </View>
      <SignOutBtn />
    </SafeAreaView>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  createEvent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 5,
    // borderStyle: "dotted",
    // borderRadius: 250,
    // width: 250,
    // height: 250,
    // margin: 20
  },
  createEventTitle: {
    fontSize: 24,
  },
  section: {
    margin: 10,
    borderWidth: 2,
    borderColor: 'dodgerblue',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    marginLeft: 14,
    marginRight: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 50,
    resizeMode: 'cover',
  },
});
