import React, { useState, useEffect } from "react";
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
import MapLocationScreen from "../screens/Maps/MapLocationScreen";
import ImportContacts from "../screens/GuestList/ImportGuests";
import UploadEventImagesScreen from "../screens/SingleEvent/UploadEventImagesScreen";
import SinglePhoto from "../screens/SingleEvent/SinglePhoto";
import globalStyles from "../utils/globalStyles";
import EditNotification from "../screens/Notifications/EditNotification";
import UploadCoverPhotoScreen from "../screens/NewEvent/UploadCoverPhotoScreen";

const Stack = createNativeStackNavigator();

const EventNavigator = (props) => {

    return (
        <Stack.Navigator initialRouteName="EventListScreen">
            <Stack.Screen
                name="EventListScreen"
                component={EventListScreen}
                options={{
                    title: "Upcoming Events",
                    headerTitleStyle: globalStyles.screenHeader,
                }}
            />
            <Stack.Screen
                name="SingleEvent"
                component={SingleEvent}
                options={{
                    title: "Event Details",
                    headerTitleStyle: globalStyles.screenHeader,
                }}
            />
            <Stack.Screen
                name="GuestProfileScreen"
                component={GuestProfileScreen}
                options={{
                    title: "My Guest Profile",
                    headerTitleStyle: globalStyles.screenHeader,
                }}
            />
            <Stack.Screen
                name="GuestListScreen"
                component={GuestListScreen}
                options={{
                    title: "Guest List",
                    headerTitleStyle: globalStyles.screenHeader,
                }}
            />
            <Stack.Screen
                name="MessageboardScreen"
                component={MessageboardScreen}
                options={{
                    title: "Messageboard",
                    headerTitleStyle: globalStyles.screenHeader,
                }}
            />
            <Stack.Screen
                name="Edit Event"
                component={EditEvent}
                options={{
                    title: "Edit Event",
                    headerTitleStyle: globalStyles.screenHeader,
                }}
            />
            <Stack.Screen
                name="Create Event"
                component={CreateEventForm}
                options={{ headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="UploadCoverPhotoScreen"
                component={UploadCoverPhotoScreen}
                options={{ title: "Upload Event Cover Photo", headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="Create Sub Event"
                component={CreateSubEvent}
                options={{ headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="Create Reminder"
                component={CreateNotification}
                options={{ headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="Create Guest List"
                component={CreateGuestList}
                options={{ headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="All Reminders"
                component={AllNotifications}
                options={{ headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="All Sub Events"
                component={AllSubEvents}
                options={{ headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="Import Contacts"
                component={ImportContacts}
                options={{ headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="Maps"
                component={MapLocationScreen}
                options={{ headerTitleStyle: globalStyles.screenHeader }}
            />
            {/* <Stack.Screen name="All Sub Events" component={AllSubEvents} /> */}
            <Stack.Screen name="Edit Reminder" component={EditNotification} />
            <Stack.Screen
                name="UploadEventImagesScreen"
                component={UploadEventImagesScreen}
                options={{
                    title: "Upload Event Images",
                    headerTitleStyle: globalStyles.screenHeader,
                }}
            />
            <Stack.Screen
                name="SinglePhoto"
                component={SinglePhoto}
                options={{ title: "" }}
            />
        </Stack.Navigator>
    );
};

export default EventNavigator;
