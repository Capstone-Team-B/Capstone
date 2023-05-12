import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { auth } from "../../../firebase";
import globalStyles from "../../utils/globalStyles";

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
        <Button
            style={globalStyles.button}
            onPress={handleSignOut}
            title="Sign out"
        />
    );
};

export default SignOutBtn;
