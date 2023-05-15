import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import Notifications from "../screens/Notifications/Notifications";
import Feather from "react-native-vector-icons/Feather";
import MyAccountNavigator from "./MyAccountNavigator";
import EventNavigator from "./EventNavigator";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const route = useRoute();
    const { uid } = route.params;
    // console.log("uid in tabnav -->", uid);
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    if (route.name === "MyAccountNavigator") {
                        iconName = "user";
                        color = focused ? "#38b6ff" : "gray";
                    } else if (route.name === "EventNavigator") {
                        iconName = "home";
                        color = focused ? "#38b6ff" : "gray";
                    } else if (route.name === "NotificationsScreen") {
                        iconName = "bell";
                        color = focused ? "#38b6ff" : "gray";
                    }
                    return (
                        <Feather
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
                options={{ title: "Notifications" }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
