import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { auth } from "../../../firebase";

const SignOutBtn = () => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("LoginScreen");
            })
            .catch((error) => alert(error.message));
    };

    return (
        <View
            style={{
                backgroundColor: "#cb6ce6",
                width: "100%",
                padding: 15,
                margin: 10,
                borderRadius: 10,
                alignItems: "center",
                color: "white"
            }}
        >
            <Button onPress={handleSignOut} title="Sign out" />
        </View>
    );
};

export default SignOutBtn;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#cb6ce6",
        width: "100%",
        padding: 15,
        margin: 10,
        borderRadius: 10,
        alignItems: "center",
    },
});
