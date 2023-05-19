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

const CheckAccountScreen = (props) => {
    console.log("props are -->", props.route.params);
    const [user, setUser] = useState(props.route.params);
    const [email, setEmail] = useState(
        "nophone@nophone.com" || user.email || ""
    );
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");

    useEffect(() => {
        setUser(props.route.params);
    }, [props]);

    const navigation = useNavigation();

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
                        Alert.alert(
                            "Your Host made an account. Let's update it."
                        );
                        navigation.navigate("CreateAccountScreen", {
                            uid: uid,
                        });
                        return;
                    } else {
                        //now should check for email not there go to create account
                        if (email === "") {
                            Alert.alert(
                                "No matching account. Let's create one"
                            );

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
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSkip}
                        required={true}
                    >
                        <Text style={styles.submitButtonText}>Skip</Text>
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
