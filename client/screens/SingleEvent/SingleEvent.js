//Nataly was here
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDatabase, ref, child, get } from 'firebase/database';

const SingleEvent = (params) => {
  const [event, setEvent] = useState(params.route.params.event);
  console.log(event);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text> {event.name}</Text>
      <Text> {event.date}</Text>
      <Text> {event.location}</Text>
      <Text>
        {' '}
        {event.starttime} & {event.endtime}
      </Text>
      <Text> {event.description}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('GuestScreen', { eventId: event.id })
        }
      >
        <Text>Get all guest</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MessageboardScreen', {
            eventId: event.id,
            name: event.name,
          })
        }
      >
        <Text>Event Messageboard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('GuestProfileScreen', { eventId: event.id })
        }
      >
        <Text>My Guest Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SingleEvent;

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
