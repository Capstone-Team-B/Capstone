import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase';
import LoginScreen from './client/screens/LoginScreen';
import TabNavigator from './client/navigation/TabNavigator';
import SplashDown from './client/screens/Splash/SplashDown';
import MessageboardScreen from './client/screens/SingleEvent/MessageBoardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // below useEffect isn't working; when the app reloads it clears logged in user data
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setLoggedInUser(currentUser);
      return;
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashDown">
        <Stack.Screen
          name="SplashDown"
          component={SplashDown}
          options={{ headerShown: false }}
          initialParams={{ loggedInUser }}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
