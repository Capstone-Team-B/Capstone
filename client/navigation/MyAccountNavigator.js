import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEventForm from "../screens/NewEvent/CreateEventScreen";
import EditAccountScreen from "../screens/MyAccount/EditAccountScreen";
import MyAccountScreen from "../screens/MyAccount/MyAccountScreen";
import ViewArchiveScreen from "../screens/MyAccount/ViewArchiveScreen";
import { useRoute } from "@react-navigation/native";
import UploadProfilePicScreen from "../screens/MyAccount/UploadProfilePicScreen";
import globalStyles from "../utils/globalStyles";

const Stack = createNativeStackNavigator();

const MyAccountNavigator = (props) => {
    const { uid } = props.route.params;

    return (
        <Stack.Navigator initialRouteName="MyAccountScreen">
            <Stack.Screen
                name="MyAccountScreen"
                component={MyAccountScreen}
                initialParams={{ uid: uid }}
                options={{ title: "My Account", headerTitleStyle: globalStyles.screenHeader}}
            />
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventForm}
                options={{ title: "Create Event", headerTitleStyle: globalStyles.screenHeader}}
            />
            <Stack.Screen
                name="EditAccountScreen"
                component={EditAccountScreen}
                initialParams={{ uid: uid }}
                options={{ title: "Edit Account", headerTitleStyle: globalStyles.screenHeader}}
            />
            <Stack.Screen
                name="UploadProfilePicScreen"
                component={UploadProfilePicScreen}
                initialParams={{ uid: uid }}
                options={{ title: "Upload Profile Picture", headerTitleStyle: globalStyles.screenHeader }}
            />
            <Stack.Screen
                name="ViewArchiveScreen"
                component={ViewArchiveScreen}
                initialParams={{ uid: uid }}
                options={{ title: "Event Archive", headerTitleStyle: globalStyles.screenHeader}}
            />
        </Stack.Navigator>
    );
};

export default MyAccountNavigator;
