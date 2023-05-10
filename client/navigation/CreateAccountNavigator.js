import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import EditAccountScreen from '../screens/MyAccount/EditAccountScreen.js';

const Stack = createNativeStackNavigator();

const CreateAccountNavigator = ({ user }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Create Account" component={EditAccountScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default CreateAccountNavigator;
