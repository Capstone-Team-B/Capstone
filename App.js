import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, createBottomTabNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AllUsers from './screens/AllUsers';
import CreateEventForm from './screens/NewEvent/CreateEventScreen';
import CreateSubEvents from './screens/NewEvent/CreateSubEventsScreen';
import CreateNotifications from './screens/NewEvent/CreateNotificationsScreen';
import CreateGuestList from './screens/NewEvent/CreateGuestListScreen';
import GuestProfileScreen from './screens/GuestProfileScreen';
import GuestScreen from './screens/GuestScreen';

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Users" component={AllUsers} />
        <Stack.Screen name="Guest" component={GuestScreen} />
        <Stack.Screen name="GuestProfile" component={GuestProfileScreen} />
        <Stack.Screen name="Create Event" component={CreateEventForm} />
        <Stack.Screen name="Create Sub Events" component={CreateSubEvents} />
        <Stack.Screen name="Create Notifications" component={CreateNotifications} />
        <Stack.Screen name="Create Guest List" component={CreateGuestList} />
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
