import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from "react-native-vector-icons/Feather";
import LoginScreen from './client/screens/LoginScreen';
import HomeScreen from './client/screens/HomeScreen';
import AllUsers from './client/screens/AllUsers';
import EventList from "./client/screens/EventList/EventList";
import MyAccount from "./client/screens/MyAccount/MyAccount";
import Notifications from "./client/screens/Notifications/Notifications";
import CreateEventForm from './client/screens/NewEvent/CreateEventScreen';
import CreateSubEvents from './client/screens/NewEvent/CreateSubEventsScreen';
import CreateNotifications from './client/screens/NewEvent/CreateNotificationsScreen';
import CreateGuestList from './client/screens/NewEvent/CreateGuestListScreen';
<<<<<<< HEAD
import GuestScreen from "./client/screens/SingleEvent/GuestScreen";
import GuestProfileScreen from "./client/screens/SingleEvent/GuestProfileScreen";
import SingleEvent from "./client/screens/SingleEvent/SingleEvent";
import SingleEvent from "./client/screens/EventList/SingleEvent";

=======
import SingleEvent from "./client/screens/EventList/SingleEvent";
import GuestScreen from "./client/screens/SingleEvent/GuestScreen";
import GuestProfileScreen from "./client/screens/SingleEvent/GuestProfileScreen";
import SingleEvent from "./client/screens/SingleEvent/SingleEvent";
>>>>>>> 5bc679d77e96c609b2ee60bef66d03880c13552d

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () =>
<Tab.Navigator
screenOptions={({ route }) => ({
  tabBarIcon: ({ focused, size, color }) => {
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
//Nataly was here
export default function App() {
  // need to add if statement that checks if logged in; if true, nav to homepage on open; else, nav to login
  return (
    <NavigationContainer>
      {/* <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size, color }) => {
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
              <Feather name={iconName} size={28} color={focused ? "dodgerblue" : "gray"}/>
            );
          },
        })}
      >
        <Tab.Screen name="My Account" component={MyAccount} />
        <Tab.Screen name="Events List" component={EventList} />
        <Tab.Screen name="Notifications" component={Notifications} />
      </Tab.Navigator> */}

      <Stack.Navigator initialRouteName='Create Event'>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        {/* <Stack.Screen name="Home" component={Tabs} /> */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Users" component={AllUsers} />
        <Stack.Screen name="Guest" component={GuestScreen} />
        <Stack.Screen name="GuestProfile" component={GuestProfileScreen} />
        <Stack.Screen name="Create Event" component={CreateEventForm} />
        <Stack.Screen name="Create Sub Events" component={CreateSubEvents} />
        <Stack.Screen name="Create Notifications" component={CreateNotifications} />
        <Stack.Screen name="Create Guest List" component={CreateGuestList} />
        <Stack.Screen name="Single event" component={SingleEvent} />
      </Stack.Navigator>
    

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
