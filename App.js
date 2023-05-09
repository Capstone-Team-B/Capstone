import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './client/screens/LoginScreen';
import HomeScreen from './client/screens/HomeScreen';
import CreateEventForm from './client/screens/NewEvent/CreateEventScreen';
import GuestScreen from './client/screens/SingleEvent/GuestScreen';
import GuestProfileScreen from './client/screens/SingleEvent/GuestProfileScreen';
import SingleEvent from './client/screens/SingleEvent/SingleEvent';
import TabNavigator from './client/navigation/TabNavigator';

const Stack = createNativeStackNavigator();

//----------------------------------------------------------------------------------------------
//a little trick when dealing with a bunch of strings like this:
const screenNames = {
  HOME: 'Home',
  GUEST: 'Guest',
  GUEST_PROFILE: 'GuestProfile',
  CREATE_EVENT: 'Create Event',
  SINGLE_EVENT: 'Single Event',
};

//and then access it like
//<Stack.Screen name={screenNames.HOME} component={HomeScreen} />
//----------------------------------------------------------------------------------------------

//Nataly was here
export default function App() {
  // need to add if statement that checks if logged in; if true, nav to homepage on open; else, nav to login
  return (
    <NavigationContainer>
      <TabNavigator />
      {/* <Stack.Navigator initialRouteName="Create Event">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Guest" component={GuestScreen} />
        <Stack.Screen name="GuestProfile" component={GuestProfileScreen} />
        <Stack.Screen name="Create Event" component={CreateEventForm} />
        <Stack.Screen name="Single event" component={SingleEvent} />
      </Stack.Navigator> */}
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
