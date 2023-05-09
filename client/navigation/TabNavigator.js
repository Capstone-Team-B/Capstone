import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyAccount from '../screens/MyAccount/MyAccount';
import EventList from '../screens/EventList/EventList';
import Notifications from '../screens/Notifications/Notifications';
import Feather from 'react-native-vector-icons/Feather';
import MessageboardScreen from '../screens/MessageBoardScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          if (route.name === 'My Account') {
            iconName = 'user';
            color = focused ? 'dodgerblue' : 'gray';
          } else if (route.name === 'Events List') {
            iconName = 'home';
            color = focused ? 'dodgerblue' : 'gray';
          } else if (route.name === 'Notifications') {
            iconName = 'bell';
            color = focused ? 'dodgerblue' : 'gray';
          }
          return (
            <Feather
              name={iconName}
              size={28}
              color={focused ? 'dodgerblue' : 'gray'}
            />
          );
        },
      })}
    >
      <Tab.Screen name="My Account" component={MyAccount} />
      <Tab.Screen name="Events List" component={EventList} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Messageboard" component={MessageboardScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
