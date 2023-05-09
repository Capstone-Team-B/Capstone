import { useNavigation } from '@react-navigation/core';
import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  query,
  orderByChild,
  orderByValue,
  limitToLast,
  equalTo,
} from 'firebase/database';
import { auth } from '../../firebase';
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

const event_name = 'test';
const user_name = auth.firstname + ' ' + auth.lastname;
const MessageboardScreen = () => {
  console.log(auth.currentUser);
  const dbRef = ref(getDatabase());
  const db = getDatabase();
  // const recentPostsRef = query(ref(db, 'messageboard'));

  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState('');

  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const handleSubmitMessage = () => {
    console.log('user clicked ');
    // this makes the unique ID for the message
    let uid = Date.now();
    const currentTime = new Date().toISOString();
    get(child(dbRef, `messageboard`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const messageList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMessages(messageList);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });

    if (newMessage !== '') {
      set(ref(db, `messageboard/${uid}`), {
        created_at: currentTime,
        event_id: 2,
        id: uid,
        message: newMessage,
        updated_at: currentTime,
        user_id: 1,
      })
        .then(() => {
          console.log('message sent');
        })
        .catch((error) => {
          console.error(error);
        });
    } else console.log('blank Message');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.eventLabel}>Messages for {event_name}</Text>
      <View style={styles.inputContainer}>
        {messages.map((message) => (
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
