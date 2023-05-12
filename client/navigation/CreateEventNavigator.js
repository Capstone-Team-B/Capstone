import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEventForm from "../screens/NewEvent/CreateEventScreen";

const Stack = createNativeStackNavigator();

const CreateEventNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Create Event" component={CreateEventForm} />
                {/* <Stack.Screen name="Create SubEvent" component={CreateSubEvent} />
        <Stack.Screen name="Create Notification" component={CreateNotification} />
        <Stack.Screen name="Create Guest List" component={CreateGuestList} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default CreateEventNavigator;
