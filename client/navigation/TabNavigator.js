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
  const route = useRoute()
  const {uid} = route.params

  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === "MyAccountNavigator") {
              iconName = "user";
              color = focused ? "dodgerblue" : "gray";
            } else if (route.name === "EventNavigator") {
              iconName = "home";
              color = focused ? "dodgerblue" : "gray";
            } else if (route.name === "NotificationsScreen") {
              iconName = "bell";
              color = focused ? "dodgerblue" : "gray";
            }
            return (
              <Feather
                name={iconName}
                size={28}
                color={focused ? "dodgerblue" : "gray"}
              />
            );
          },
        })}
      >
        <Tab.Screen name="MyAccountNavigator" component={MyAccountNavigator} options={{ headerShown: false, tabBarLabel: "My Account" }}/>
        <Tab.Screen name="EventNavigator" component={EventNavigator} options={{ headerShown: false, tabBarLabel: "Events" }}/>
        <Tab.Screen name="NotificationsScreen" component={Notifications} options={{ title: "Notifications" }}/>
      </Tab.Navigator>
  );
};

export default TabNavigator;
