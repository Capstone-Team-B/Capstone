import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from "react-native-vector-icons/Feather";
import MyAccount from './MyAccount/MyAccount';
import EventList from './EventList/EventList'
import Notifications from './Notifications/Notifications'

const Tab = createBottomTabNavigator();

const TabBar = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Events List"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              if (route.name === "My Account") {
                iconName = "user";
                color = focused ? "dodgerblue" : "gray";
              } else if (route.name === "Events List") {
                iconName = "home";
                color = focused ? "dodgerblue" : "gray";
              } else if (route.name === "Notifications") {
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
          <Tab.Screen name="My Account" component={MyAccount} />
          <Tab.Screen name="Events List" component={EventList} />
          <Tab.Screen name="Notifications" component={Notifications} />
        </Tab.Navigator>
      </NavigationContainer>
  )
}

export default TabBar