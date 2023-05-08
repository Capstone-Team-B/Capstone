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
import { auth } from "../firebase";
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

const GuestScreen = () => {
    const [users, setUsers] = useState([]);
    const [guestUsers, setguestUsers] = useState([]);
    const dbRef = ref(getDatabase());
    //console.log(setguestUsers);
    get(child(dbRef, `users`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const userList = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
        }));
        setUsers(userList);
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
    const _query = query(
        child(dbRef, "guestlists"),
        orderByChild("role"),
        equalTo("Guest")
    );
    get(_query)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const userList = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
            }));
        setguestUsers(userList);
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
    return (
        <ScrollView>
            <Text>Guest Profile</Text>
        </ScrollView>
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
