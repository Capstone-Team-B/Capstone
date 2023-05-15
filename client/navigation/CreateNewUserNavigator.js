import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EditAccountScreen } from "../screens/MyAccount/EditAccountScreen";
import globalStyles from "../utils/globalStyles";

const Stack = createNativeStackNavigator();

const CreateNewUserNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Create User"
                    component={EditAccountScreen}
                    options={{headerTitleStyle: globalStyles.screenHeader}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default CreateNewUserNavigator;
