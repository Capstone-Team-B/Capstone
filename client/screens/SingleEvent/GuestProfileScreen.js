import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    query,
    orderByChild,
    equalTo,
} from "firebase/database";

const GuestProfileScreen = (params) => {
  const [user, setUser] = useState(params.route.params.user);
  console.log(params.route.params.user, "Naty");

  //const dbRef = ref(getDatabase());
  console.log(user);

  return (
    <ScrollView>
      <Text style={styles.title}>Guest Profile</Text>
      <View style={styles.container}>
        <Text>
          <Text style={styles.label}>Name:</Text>
          <Text>{user?.firstName}</Text>
        </Text>
        <Text>
          <Text style={styles.label}>Email:</Text>
          <Text>{user?.email}</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default GuestProfileScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    width: "90%",
    borderRadius: 8,
    border: 1,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  label:{
    fontWeight: "bold"
  }
});
