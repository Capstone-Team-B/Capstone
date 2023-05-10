import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, Text, Pressable, View, Button } from "react-native";
import { auth } from "../../../firebase";

const SignOutBtn = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <Button onPress={handleSignOut} title="Sign out" />
  );
};

export default SignOutBtn;

const styles = StyleSheet.create({
});
