import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AllUsers from './screens/AllUsers';
import CreateEventForm from './screens/NewEvent/CreateEventScreen';
import CreateSubEvents from './screens/NewEvent/CreateSubEventsScreen';
import CreateNotifications from './screens/NewEvent/CreateNotificationsScreen';
import CreateGuestList from './screens/NewEvent/CreateGuestListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Create Event'>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Users" component={AllUsers} />
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
