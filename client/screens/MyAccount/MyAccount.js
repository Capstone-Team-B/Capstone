import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import SignOutBtn from "./SignOutBtn";

const MyAccount = () => {
  return (
    <SafeAreaView>
      <Text>My Account</Text>
      <SignOutBtn />
    </SafeAreaView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({});
