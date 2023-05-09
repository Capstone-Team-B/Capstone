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
import GuestScreen from "./client/SingleEvent/GuestScreen";
import GuestProfileScreen from "./client/SingleEvent/GuestProfileScreen";
import SingleEvent from "./client/SingleEvent/SingleEvent";

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
      {/* <Stack.Navigator> */}
      {/* <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} /> */}
      {/* {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      {/* <Stack.Screen name="Users" component={AllUsers} /> */}
      {/* <Stack.Screen name="Events List" component={EventList} /> */}
      {/* </Stack.Navigator> */}
      
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="Guest" component={GuestScreen} />
        <Stack.Screen name="GuestProfile" component={GuestProfileScreen} />
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
