import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
    getDatabase,
    ref,
    child,
    get,
    query,
    orderByChild,
    equalTo,
} from "firebase/database";

const refExistsCheck = (snapshot) => {
    if (snapshot.exists()) {
        const userRef = snapshot.val();
        const uid = Object.keys(userRef)[0];
        Alert.alert("Your Host made an account. Let's update it.");
        navigation.navigate("CreateAccountScreen", {
            uid: uid,
        });
        return;
    }
};

const checkEmail = (email) => {
    get(
        query(child(dbRef, "users"), orderByChild("email"), equalTo(email))
    ).then(refExistsCheck());
};

const checkPhoneNumber = (phoneNumber) => {
    get(
        query(
            child(dbRef, "users"),
            orderByChild("phoneNumber"),
            equalTo(phoneNumber)
        )
    );
};

const handleSubmit = async () => {
    //Make sure phone or email is entered to look up
    console.log("submit clicked");
    if (phoneNumber === "" && email === "") {
        Alert.alert(`Please provide an email or phone number`);
        return;
    }
    // check for matching phone number first
    if (phoneNumber === "") {
        console.log("run check email?");
    }
    try {
        const dbRef = ref(getDatabase());
        get(
            query(
                child(dbRef, "users"),
                orderByChild("phoneNumber"),
                equalTo(phoneNumber)
            )
        )
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userRef = snapshot.val();
                    const uid = Object.keys(userRef)[0];
                    Alert.alert("Your Host made an account. Let's update it.");
                    navigation.navigate("CreateAccountScreen", {
                        uid: uid,
                    });
                    return;
                } else {
                    //now should check for email not there go to create account
                    if (email === "") {
                        Alert.alert("No matching account. Let's create one");

                        navigation.navigate("CreateAccountScreen", {
                            uid: "",
                        });
                        return;
                    }
                    console.log("Checking for email ", email);
                    get(
                        query(
                            child(dbRef, "users"),
                            orderByChild("email"),
                            equalTo(email)
                        )
                    ).then((snapshot) => {
                        console.log("Checked for email ", email);
                        if (snapshot.exists()) {
                            const userRef = snapshot.val();
                            const uid = Object.keys(userRef)[0];
                            navigation.navigate("CreateAccountScreen", {
                                uid: uid || "",
                            });
                        } else {
                            console.log("No email found");
                            Alert.alert(
                                "No matching account. Let's create one"
                            );
                            navigation.navigate("CreateAccountScreen", {
                                uid: "",
                            });
                        }
                    });
                    Alert.alert("No matching account. Let's create one");
                    navigation.navigate("CreateAccountScreen", { uid: "" });
                }
            })
            .catch((error) => {
                console.log("line 105", error);
            });
    } catch (error) {
        console.log(error);
    }
};

const handleSkip = async () => {
    navigation.navigate("CreateAccountScreen", { uid: "" });
};

export default checkFunctions;
