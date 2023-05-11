import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const SplashDown = ({ route }) => {
    const navigation = useNavigation();
    const { loggedInUser } = route.params;
    console.log(loggedInUser);
    useEffect(() => {
        if (loggedInUser) {
            setTimeout(() => {
                navigation.navigate("TabNav", {
                    screen: "EventNavigator",
                    uid: loggedInUser.uid,
                });
            }, 1000);
        } else {
            setTimeout(() => {
                navigation.navigate("LoginScreen");
            }, 1000);
        }
    });
    return (
        <View style={styles.container}>
            <Text>SplashDown</Text>
        </View>
    );
};

export default SplashDown;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
