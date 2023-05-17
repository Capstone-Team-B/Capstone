import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import Notifications from "../screens/Notifications/Notifications";
import Ionicons from "react-native-vector-icons/Ionicons";
import MyAccountNavigator from "./MyAccountNavigator";
import EventNavigator from "./EventNavigator";
import globalStyles from "../utils/globalStyles";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const route = useRoute();
    const { uid } = route.params;
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    if (route.name === "MyAccountNavigator") {
                        iconName = "person-outline";
                        color = focused ? "#38b6ff" : "gray";
                    } else if (route.name === "EventNavigator") {
                        iconName = "home-outline";
                        color = focused ? "#38b6ff" : "gray";
                    } else if (route.name === "NotificationsScreen") {
                        iconName = "notifications-outline";
                        color = focused ? "#38b6ff" : "gray";
                    }
                    return (
                        <Ionicons
                            name={iconName}
                            size={28}
                            color={focused ? "#38b6ff" : "gray"}
                        />
                    );
                },
                tabBarActiveTintColor: "#38b6ff",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: [
                    {
                        display: "flex",
                        padding: 12,
                    },
                    null,
                ],
            })}
        >
            <Tab.Screen
                name="MyAccountNavigator"
                component={MyAccountNavigator}
                initialParams={{ uid: uid }}
                options={{
                    headerShown: false,
                    tabBarLabel: "My Account",
                }}
            />
            <Tab.Screen
                name="EventNavigator"
                component={EventNavigator}
                initialParams={{ uid: uid }}
                options={{
                    headerShown: false,
                    tabBarLabel: "Events",
                }}
            />
            <Tab.Screen
                name="NotificationsScreen"
                component={Notifications}
                initialParams={{ uid: uid }}
                options={{
                    title: "Notifications",
                    headerTitleStyle: globalStyles.screenHeader,  //!!!KIT this formatting doesn't work
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
