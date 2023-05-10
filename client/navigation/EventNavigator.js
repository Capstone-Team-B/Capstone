import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SingleEvent from "../screens/SingleEvent/SingleEvent";
import GuestProfileScreen from "../screens/SingleEvent/GuestProfileScreen";
import GuestScreen from "../screens/SingleEvent/GuestScreen";
import EventListScreen from "../screens/EventList/EventListScreen";


const Stack = createNativeStackNavigator();

const EventNavigator = (props) => {
  const { uid } = props.route.params;
  // console.log("uid in EventNav -->", uid);
  return (
    <Stack.Navigator initialRouteName="EventListScreen">
      <Stack.Screen
        name="EventListScreen"
        component={EventListScreen}
        initialParams={{ uid: uid }}
        options={{ title: "Upcoming Events" }}
      />
      <Stack.Screen
        name="SingleEvent"
        component={SingleEvent}
        initialParams={{ uid: uid }}
        options={{ title: "Event" }}
      />
      <Stack.Screen
        name="GuestProfileScreen"
        component={GuestProfileScreen}
        initialParams={{ uid: uid }}
        options={{ title: "My Guest Profile" }}
      />
      <Stack.Screen
        name="GuestScreen"
        component={GuestScreen}
        initialParams={{ uid: uid }}
        options={{ title: "Guest List" }}
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
