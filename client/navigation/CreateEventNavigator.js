import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEventForm from "../screens/NewEvent/CreateEventScreen";
import CreateSubEvents from "../screens/NewEvent/CreateSubEventsScreen";
import CreateNotifications from "../screens/NewEvent/CreateNotificationsScreen";
import CreateGuestList from "../screens/NewEvent/CreateGuestListScreen";

const Stack = createNativeStackNavigator();

const CreateEventNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Create Event" component={CreateEventForm} />
        <Stack.Screen name="Create Sub Events" component={CreateSubEvents} />
        <Stack.Screen
          name="Create Notifications"
          component={CreateNotifications}
        />
        <Stack.Screen name="Create Guest List" component={CreateGuestList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default CreateEventNavigator;
