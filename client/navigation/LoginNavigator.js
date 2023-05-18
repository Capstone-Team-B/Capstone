import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/LoginScreen";
import EventListScreen from "../screens/EventList/EventListScreen";
// import CheckAccountScreen from "../screens/MyAccount/CheckAccountScreen";
import globalStyles from "../utils/globalStyles";

const Stack = createNativeStackNavigator();

const LoginNavigator = ({ user }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                    name="EventListScreen"
                    component={EventListScreen}
                    user={user}
                />
                {/* <Stack.Screen
                    name="CheckAccountScreen"
                    component={CheckAccountScreen}
                /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default LoginNavigator;
