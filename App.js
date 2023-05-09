import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AllUsers from "./screens/AllUsers";
import EventList from "./client/screens/EventList/EventList";
import MyAccount from "./client/screens/MyAccount/MyAccount";
import Notifications from "./client/screens/Notifications/Notifications";
import GuestScreen from "./screens/GuestScreen";
import GuestProfileScreen from "./screens/GuestProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";
import * as firebase from "./firebase";
import auth from "./firebase";
import { useState, useEffect } from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = firebase.auth().currentUser
      if (user) {
        console.log(user);
        setLoggedIn(true);
      } else {
        console.log("logged out");
      }
    }, []);

  // need to add if statement that checks if logged in; if true, nav to homepage on open; else, nav to login
  return loggedIn ? (
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
      {/* <Stack.Screen name="Guest" component={GuestScreen} />
      <Stack.Screen name="GuestProfile" component={GuestProfileScreen} /> */}
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        {/* {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        {/* <Stack.Screen name="Users" component={AllUsers} /> */}
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
