import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase";

const HomeScreen = () => {
  const navigation = useNavigation();
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
        <Text>Email: {auth.currentUser?.email}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("GuestProfile")}>
            <Text> 
              Guest Profile
            </Text>
          </TouchableOpacity>
    {/*       <Text>Email: {auth.currentUser?.email}</Text> */}
          <TouchableOpacity onPress={() => navigation.navigate("Guest")}>
            <Text> 
              View All Guests
            </Text>
          </TouchableOpacity>

<<<<<<< HEAD
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
            <Text style={{ color: 'darkblue', fontWeight: 'bold' }} onPress={() => navigation.navigate("Users")}>
                View All Users
            </Text>
        </Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
            <Text style={{ color: 'darkblue', fontWeight: 'bold' }} onPress={() => navigation.navigate("Create Event")}>
                Create New Event
            </Text>
        </Text>
=======
    <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>
        <Text
          style={{ color: "darkblue", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Users")}
        >
          View All Users
        </Text>
      </Text>
>>>>>>> 8342f16 (Single page Working and guest profile)
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
