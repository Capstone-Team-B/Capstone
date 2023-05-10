import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEventForm from "../screens/NewEvent/CreateEventScreen";
import CreateSubEvent from "../screens/SubEvents/CreateSubEventScreen";
import CreateNotification from "../screens/Notifications/CreateNotificationScreen";
import CreateGuestList from "../screens/GuestList/CreateGuestListScreen";
import AllNotifications from "../screens/Notifications/AllNotifications";
import AllSubEvents from "../screens/SubEvents/AllSubEvents";
import EditEvent from "../screens/NewEvent/EditEventScreen";

const Stack = createNativeStackNavigator();

const EditEventNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Edit Event" component={EditEvent} />
        <Stack.Screen name="Create Event" component={CreateEventForm} />
        <Stack.Screen name="Create Sub Event" component={CreateSubEvent} />
        <Stack.Screen name="Create Notification" component={CreateNotification} />
        <Stack.Screen name="Create Guest List" component={CreateGuestList} />
        <Stack.Screen name="All Notifications" component={AllNotifications} />
        <Stack.Screen name="All Sub Events" component={AllSubEvents} />
        {/* <Stack.Screen name="All Guest List" component={AllGuestList} />
        <Stack.Screen name="Single Notification" component={AllGuestList} />
        <Stack.Screen name="Single SubEvent" component={AllGuestList} />
        <Stack.Screen name="Single Guest" component={AllGuestList} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default EditEventNavigator;
