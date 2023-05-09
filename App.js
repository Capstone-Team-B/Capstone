import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import * as React from "react";
import * as SecureStore from "expo-secure-store";
import LoginScreen from "./screens/LoginScreen";
import SplashScreen from "./client/screens/LoginScreen/SplashScreen";
import TabBar from "./client/screens/TabBar";
import { auth } from "./firebase";
// import GuestScreen from "./screens/GuestScreen";
// import GuestProfileScreen from "./screens/GuestProfileScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } 
    });
    setIsLoading(false)
    return unsubscribe;
  }, []);

  // while obtaining auth token, display SplashScreen (loading screen)
  if (isLoading) {
    return <SplashScreen />;
  }

  // // if auth token is found, return tab navigation view
  if (user) {
    return <TabBar />;
  }

  // if no auth token is found, show the login page
  return <LoginScreen options={{ headerShown: false }} />;
}
