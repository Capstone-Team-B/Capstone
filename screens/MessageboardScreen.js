import { useNavigation } from '@react-navigation/core';
import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { auth } from '../firebase';
import { getDatabase, ref, child, get } from 'firebase/database';
import { collection, query, where } from 'firebase/firestore';
import { dummyDb } from '../server/seedData';

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
);

let testMessageboard = dummyDb.messageboard;

const testNotifications = [
  {
    body: 'The wedding ceremony will start in 30 minutes!',
    event_id: 1,
    id: 1,
    scheduled_time: '2022-08-01T19:30:00Z',
    title: 'Reminder: Wedding Ceremony',
  },
  {
    body: 'The wedding reception will start in 1 hour!',
    event_id: 1,
    id: 2,
    scheduled_time: '2022-08-01T20:00:00Z',
    title: 'Reminder: Wedding Reception',
  },
  {
    body: 'The birthday party will start in 2 hours!',
    event_id: 2,
    id: 3,
    scheduled_time: '2022-09-01T18:00:00Z',
    title: 'Reminder: Birthday Party',
  },
];
const event_name = dummyDb.events[0].name;
const user_name = dummyDb.users[0].firstname + ' ' + dummyDb.users[0].lastname;
const MessageboardScreen = () => {
  // console.log(auth);
  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState('');

  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // keeping sign out functionality
  const handleSubmitMessage = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.eventLabel}>Messages for {event_name}</Text>
      <View style={styles.inputContainer}>
        {testMessageboard.map((message) => (
          <View key={message.id} style={styles.item}>
            <Text style={styles.firstName}>{message.message}</Text>
            <Text style={styles.nameText}>{user_name}</Text>
          </View>
        ))}
        <TextInput
          placeholder="Write here"
          style={styles.input}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <TouchableOpacity onPress={handleSubmitMessage} style={styles.button}>
          <Text style={styles.buttonText}>Add Your Message</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
          <Text
            style={{ color: 'darkblue', fontWeight: 'bold' }}
            onPress={() => navigation.navigate('Login')}
          >
            View Home
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  nameText: {
    color: 'blue',
    fontWeight: '400',
    fontSize: '12',
  },
  eventLabel: {
    color: 'purple',
    fontWeight: '700',
    fontSize: '24',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
