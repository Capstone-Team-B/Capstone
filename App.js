import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase";
import LoginScreen from "./client/screens/LoginScreen";
import TabNavigator from "./client/navigation/TabNavigator";
import SplashDown from "./client/screens/Splash/SplashDown";
import MessageboardScreen from "./client/screens/SingleEvent/MessageBoardScreen";
import HomeScreen from "./client/screens/HomeScreen";
import CreateEventForm from "./client/screens/NewEvent/CreateEventScreen";
import GuestScreen from "./client/screens/SingleEvent/GuestScreen";
import GuestProfileScreen from "./client/screens/SingleEvent/GuestProfileScreen";
import SingleEvent from "./client/screens/SingleEvent/SingleEvent";
import MapEventScreen from "./client/screens/Maps/MapsandEvents";
import * as SplashScreen from "expo-splash-screen";
import { Video } from "expo-av";

//import MessageboardScreen from "./client/screens/MessageBoardScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  function handleVideoEnd() {
    setShowSplash(false);
  }

  if (showSplash) {
    return (
      <View style={styles.container}>
        <StatusBar />
        <Video
          source={require("./assets/BeThereAnimation.mp4")}
          style={styles.video}
          shouldPlay
          isLooping={false}
          resizeMode="cover"
          onPlaybackStatusUpdate={(status) => {
            if (!status.isPlaying && status.didJustFinish) {
              handleVideoEnd();
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TabNav"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Guest" component={GuestScreen} />
          <Stack.Screen name="GuestProfile" component={GuestProfileScreen} />
          <Stack.Screen name="Create Event" component={CreateEventForm} />
          <Stack.Screen name="Single event" component={SingleEvent} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  video: {
    flex: 1,
  },
});
