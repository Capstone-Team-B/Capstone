import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEventForm from "../screens/NewEvent/CreateEventScreen";
import EditAccountScreen from "../screens/MyAccount/EditAccountScreen";
import EditPrefsScreen from "../screens/MyAccount/EditPrefsScreen";
import MyAccountScreen from "../screens/MyAccount/MyAccountScreen";
import ViewArchiveScreen from "../screens/MyAccount/ViewArchiveScreen";
import { useRoute } from "@react-navigation/native";
import UploadProfilePicScreen from "../screens/MyAccount/UploadProfilePicScreen";

const Stack = createNativeStackNavigator();

const MyAccountNavigator = (props) => {
    const { uid } = props.route.params;
    // console.log("uid in MyAccountNav -->", uid);
    return (
        <Stack.Navigator initialRouteName="MyAccountScreen">
            <Stack.Screen
                name="MyAccountScreen"
                component={MyAccountScreen}
                initialParams={{ uid: uid }}
                options={{ title: "My Account" }}
            />
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventForm}
                initialParams={{ uid: uid }}
            />
            <Stack.Screen
                name="EditAccountScreen"
                component={EditAccountScreen}
                initialParams={{ uid: uid }}
                options={{ title: "Edit Account" }}
            />
            <Stack.Screen
                name="EditPrefsScreen"
                component={EditPrefsScreen}
                initialParams={{ uid: uid }}
                options={{ title: "Edit Guest Preferences" }}
            />
            {/* EH Removed doupled up edit pref update Profile screen */}
            <Stack.Screen
                name="UploadProfilePicScreen"
                component={UploadProfilePicScreen}
                initialParams={{ uid: uid }}
                options={{ title: "Upload Profile Picture" }}
            />
            <Stack.Screen
                name="ViewArchiveScreen"
                component={ViewArchiveScreen}
                initialParams={{ uid: uid }}
                options={{ title: "Event Archive" }}
            />
        </Stack.Navigator>
    );
};

export default MyAccountNavigator;
