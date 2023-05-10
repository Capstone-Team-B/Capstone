import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SingleEvent from '../screens/SingleEvent/SingleEvent';
import GuestProfileScreen from '../screens/SingleEvent/GuestProfileScreen';
import GuestScreen from '../screens/SingleEvent/GuestScreen';
import EventListScreen from '../screens/EventList/EventListScreen';
import MessageboardScreen from '../screens/SingleEvent/MessageBoardScreen';

const Stack = createNativeStackNavigator();

const EventNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="EventListScreen">
      <Stack.Screen
        name="EventListScreen"
        component={EventListScreen}
        options={{ title: 'Upcoming Events' }}
      />
      <Stack.Screen
        name="SingleEvent"
        component={SingleEvent}
        options={{ title: 'Event' }}
      />
      <Stack.Screen
        name="GuestProfileScreen"
        component={GuestProfileScreen}
        options={{ title: 'My Guest Profile' }}
      />
      <Stack.Screen
        name="GuestScreen"
        component={GuestScreen}
        options={{ title: 'Guest List' }}
      />
      <Stack.Screen
        name="MessageboardScreen"
        component={MessageboardScreen}
        options={{ title: 'Messageboard' }}
      />
    </Stack.Navigator>
  );
};

export default EventNavigator;
