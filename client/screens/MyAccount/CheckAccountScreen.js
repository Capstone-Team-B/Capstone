// Let's see if your Host started an Account for you.
// First what is your phone number, name and email?

//

// if (accountExists) {
//     //direct to update account page
// } else {
//     //direct to create new Account page
// }

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
    SafeAreaView,
    Button,
} from "react-native";
// import { auth } from "../../../firebase";
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

const CheckAccountScreen = (props) => {
    console.log("props are -->", props.route.params);
    const [user, setUser] = useState(props.route.params);
    const [email, setEmail] = useState(user.email || "");
    const [phoneNumber, setPhoneNumber] = useState(
        "(975) 555-5555" || user.phoneNumber || ""
    );

    useEffect(() => {
        setUser(props.route.params);
    }, [props]);

    const navigation = useNavigation();

    const handleSubmit = async () => {
        //Make sure phone or email is entered
        console.log("submit clicked");
        if (phoneNumber === "" && email === "") {
            Alert.alert(`Please provide an email or phone number`);
            return;
        }
        // check for matching phone number
        console.log("Checking for phoneNumber ", phoneNumber);
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
                        Alert.alert("Account found. Let's update it.");
                        navigation.navigate("CreateAccountScreen", {
                            uid: uid,
                        });
                    } else {
                        Alert.alert("No matching account. Let's create one");
                        navigation.navigate("CreateAccountScreen");
                    }
                })
                .catch((error) => {
                    console.log("line 83", error);
                });
            console.log("Checking for email ", email);
            get(
                query(
                    child(dbRef, "users"),
                    orderByChild("email"),
                    equalTo(email)
                )
            )
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userRef = snapshot.val();
                        const uid = Object.keys(userRef)[0];
                        navigation.navigate("CreateAccountScreen", {
                            uid: uid,
                        });
                    } else {
                        console.log("No email found");
                    }
                })
                .catch((error) => {
                    console.log("line 83", error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Checking for Account
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        required={true}
                    >
                        <Text style={styles.submitButtonText}>
                            Check for Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: "#007bff",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "white",
        borderColor: "#dc3545",
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    deleteButtonText: {
        color: "#dc3545",
        fontSize: 14,
        fontWeight: "bold",
    },
    outlineButton: {
        backgroundColor: "white",
        borderColor: "#007bff",
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    outlineButtonText: {
        color: "#007bff",
        fontSize: 14,
        fontWeight: "bold",
    },
    submitButton: {
        backgroundColor: "#2E8B57",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CheckAccountScreen;
