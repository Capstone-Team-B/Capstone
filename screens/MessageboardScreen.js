import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';
import { getDatabase, ref, child, get } from 'firebase/database';
import { collection, query, where } from 'firebase/firestore';

const testDataMessage = [
  {
    created_at: '2022-06-01T12:00:00Z',
    event_id: 1,
    id: 1,
    message: 'Excited for the wedding!',
    updated_at: '2022-06-01T12:00:00Z',
    user_id: 2,
  },
  {
    created_at: '2022-06-02T10:30:00Z',
    event_id: 1,
    id: 2,
    message: "Me too! Can't wait to see everyone!",
    updated_at: '2022-06-02T10:30:00Z',
    user_id: 3,
  },
  {
    created_at: '2022-07-01T09:15:00Z',
    event_id: 2,
    id: 3,
    message: 'Had a great time at the wedding last night!',
    updated_at: '2022-07-01T09:15:00Z',
    user_id: 1,
  },
];
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

const MessageboardScreen = () => {
  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState('');

  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // keeping sign out functionality
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>Messages: {auth.currentUser?.email}</Text>
      {testDataMessage.map((message) => (
        <View key={message.id} style={styles.item}>
          <Text style={styles.firstName}>{message.message}</Text>
          <Text style={styles.email}>{message.email}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
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
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
