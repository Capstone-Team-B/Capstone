import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, child, get, set } from "firebase/database";
const BeThereLogoExpanded = require("../../assets/BeThereExpanded.png");

const LoginScreen = () => {
    const [email, setEmail] = useState("elizabeth.house88@gmail.com");
    const [password, setPassword] = useState("123456");

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // console.log("uid on loginscreen -->", user.uid)
                navigation.navigate("TabNav", {
                    screen: "EventNavigator",
                    uid: user.uid,
                });
                return;
            }
        });
        return unsubscribe;
    }, [handleLogin]);

    const handleSignUp = () => {
        const dbRef = ref(getDatabase());
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        // Check if the email entered during registration already exists in the database
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists) {
                const data = snapshot.val();
                const existingUser = Object.keys(data).find(
                    (key) => data[key].email === email
                );
                if (!existingUser) {
                    navigation.navigate("EditAccountScreen");
                } else {
                    auth.signInWithEmailAndPassword(email, password)
                        .then((userCredentials) => {
                            const user = userCredentials.user;
                            console.log("Logged in with: ", user.email);
                        })
                        .catch((error) => alert(error.message));
                }
            } else {
                navigation.navigate("EditAccountScreen");
            }
        });
    };

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log("Logged in with: ", user.email);
            })
            .catch((error) => alert(error.message));
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.inputContainer}>
                <View style={{ justifyContent: "center" }}>
                    <Image
                        source={BeThereLogoExpanded}
                        style={{ height: 250, width: 250 }}
                    />
                </View>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

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
