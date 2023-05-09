//Nataly was here
import { useNavigation } from "@react-navigation/core";
import {
  //KeyboardAvoidingView,
  //ScrollView,
  StyleSheet,
  Text,
  //TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
//import { useNavigation } from "@react-navigation/native";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  query,
  orderByChild,
  equalTo,
  orderByValue
} from "firebase/database";

const GuestScreen = (params) => {
  const [guestUsers, setguestUsers] = useState([]);
  const dbRef = ref(getDatabase());
  console.log(params.route.params.eventId)
  
  const navigation = useNavigation();

useEffect(()=>{
  get(query(child(dbRef, 'guestlist'), orderByChild("event_id"), equalTo(params.route.params.eventId)))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data)
      setguestUsers(data);
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
}, [params.route.params.eventId])
//
  return (
    <View style={styles.container}>
        <Text> Guest list</Text>
        {
          guestUsers.map((user, index)=>
      <TouchableOpacity key={index} onPress={() => navigation.navigate("GuestProfile", {user})}>
      Guest Profile {user.guest_id}
      </TouchableOpacity>
      )
        }
    </View>
  );
};

export default GuestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
