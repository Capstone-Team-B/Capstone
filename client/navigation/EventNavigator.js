import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SingleEvent from "../screens/SingleEvent/SingleEvent";
import GuestProfileScreen from "../screens/SingleEvent/GuestProfileScreen";
import GuestListScreen from "../screens/SingleEvent/GuestListScreen";
import EventListScreen from "../screens/EventList/EventListScreen";
import MessageboardScreen from "../screens/SingleEvent/MessageBoardScreen";
import EditEvent from "../screens/NewEvent/EditEventScreen";
import CreateEventForm from "../screens/NewEvent/CreateEventScreen";
import CreateSubEvent from "../screens/SubEvents/CreateSubEventScreen";
import CreateNotification from "../screens/Notifications/CreateNotificationScreen";
import CreateGuestList from "../screens/GuestList/CreateGuestListScreen";
import AllNotifications from "../screens/Notifications/AllNotifications";
import AllSubEvents from "../screens/SubEvents/AllSubEvents";
import MapEventScreen from "../screens/Maps/MapsandEvents";
import ImportContacts from "../screens/GuestList/ImportGuests";
import UploadEventImagesScreen from "../screens/SingleEvent/UploadEventImagesScreen";
import EventGallery from "../screens/SingleEvent/EventGallery";

const Stack = createNativeStackNavigator();

const EventNavigator = (props) => {
    const { uid } = props.route.params;

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
                name="GuestListScreen"
                component={GuestListScreen}
                initialParams={{ uid: uid }}
                options={{ title: "Guest List" }}
            />
            <Stack.Screen
                name="MessageboardScreen"
                component={MessageboardScreen}
                options={{ title: "Messageboard" }}
            />
            <Stack.Screen
                name="Edit Event"
                component={EditEvent}
                options={{ title: "Edit Event" }}
            />
            <Stack.Screen name="Create Event" component={CreateEventForm} />
            <Stack.Screen name="Create Sub Event" component={CreateSubEvent} />
            <Stack.Screen
                name="Create Notification"
                component={CreateNotification}
            />
            <Stack.Screen
                name="Create Guest List"
                component={CreateGuestList}
            />
            <Stack.Screen
                name="All Notifications"
                component={AllNotifications}
            />
            <Stack.Screen name="All Sub Events" component={AllSubEvents} />
            <Stack.Screen name="Import Contacts" component={ImportContacts} />
            <Stack.Screen name="Maps" component={MapEventScreen} />
            <Stack.Screen
                name="UploadEventImagesScreen"
                component={UploadEventImagesScreen}
                initialParams={{ uid: uid }}
                options={{ title: "UploadEventImagesScreen" }}
            />
            <Stack.Screen
                name="EventGallery"
                component={EventGallery}

                options={{ title: "Event Gallery" }}
            />
        </Stack.Navigator>
    );
};

export default EventNavigator;
