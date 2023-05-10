import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEventForm from "../screens/NewEvent/CreateEventScreen"
import EditAccountScreen from '../screens/MyAccount/EditAccountScreen';
import EditPrefsScreen from '../screens/MyAccount/EditPrefsScreen';
import MyAccountScreen from '../screens/MyAccount/MyAccountScreen';
import ViewArchiveScreen from '../screens/MyAccount/ViewArchiveScreen';

const Stack = createNativeStackNavigator();

const MyAccountNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='MyAccountScreen'>
        <Stack.Screen name="MyAccountScreen" component={MyAccountScreen} options={{ title: "My Account" }}/>
        <Stack.Screen name="CreateEvent" component={CreateEventForm} />
        <Stack.Screen name="EditAccountScreen" component={EditAccountScreen} options={{title: "Edit Account"}}/>
        <Stack.Screen name="EditPrefsScreen" component={EditPrefsScreen} options={{title: "Edit Guest Preferences"}}/>
        <Stack.Screen name="ViewArchiveScreen" component={ViewArchiveScreen} options={{title: "Event Archive"}}/>
    </Stack.Navigator>
  )
}

export default MyAccountNavigator