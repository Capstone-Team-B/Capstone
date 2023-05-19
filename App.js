import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./client/screens/LoginScreen";
import TabNavigator from "./client/navigation/TabNavigator";
import { Video } from "expo-av";
import { useFonts } from "expo-font";
import CheckAccountScreen from "./client/screens/MyAccount/CheckAccountScreen";
import CreateAccountScreen from "./client/screens/MyAccount/CreateAccountScreen";
import { RootSiblingParent } from "react-native-root-siblings";

const Stack = createNativeStackNavigator();

export default function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [fontsLoaded] = useFonts({
        "Bukhari Script": require("./assets/fonts/BukhariScript.ttf"),
    });

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
        <RootSiblingParent>
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
                        {/* ENH added in checkaccount and create account screen */}
                        <Stack.Screen
                            name="CheckAccountScreen"
                            component={CheckAccountScreen}
                        />
                        <Stack.Screen
                            name="CreateAccountScreen"
                            component={CreateAccountScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        </RootSiblingParent>
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
