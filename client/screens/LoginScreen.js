import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ImageBackground,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { getDatabase, ref, child, get, set } from "firebase/database";
const BeThereLogoExpanded = require("../../assets/BeThereExpanded.png");
const Background = require("../../assets/Background.png");
import { useAtom } from "jotai";
import { user as userStore } from "../store/user";

const LoginScreen = () => {
    const [email, setEmail] = useState("kit@kit.com"); // logging in as kit, who is the host of an event
    const [password, setPassword] = useState("pwpwpw");
    const [storeUser, setStoreUser] = useAtom(userStore);

    const navigation = useNavigation();

    // It's hard to tell without seeing the rest of the code and how the navigation variable is defined. However, assuming that navigation is correctly defined and imported from the react-navigation library, there could be a few reasons why the component is not navigating to the "Create User" page:

    // The component may not be rendered within a navigator: In order for the navigation prop to be passed down to the component, it must be rendered within a navigator component (e.g. StackNavigator, DrawerNavigator, etc.). Make sure that the component that contains the showAlert function is rendered within a navigator.

    // The screen name "Create User" may not match the actual screen name: The navigation.navigate function takes the name of the destination screen as an argument. Make sure that the name "Create User" matches the actual screen name defined in the navigator.
    const showAlert = () => {
        return Alert.alert(
            "User Not Found",
            "Would you like to create a BeThere account?",
            [
                {
                    text: "Yes Please",
                    // need to go to the check for user
                    onPress: () =>
                        navigation.navigate("LoginNavigator", {
                            screen: "Check User",
                        }),
                    //navigation()
                },
                {
                    text: "No Thank you",
                    onPress: () => Alert.alert("no Pressed"),
                },
            ]
        );
    };

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
        // Check if the email entered during registration already exists in the database
        // should this also check if they are signed up too?
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists) {
                const data = snapshot.val();
                const existingUser = Object.keys(data).find(
                    (key) => data[key].email === email
                );
                console.log("existing user uid --> ", existingUser);
                if (!existingUser) {
                    console.log("no existing user", email);
                    navigation.navigate("CheckAccountScreen", {
                        screen: "EventNavigator",
                        email: email,
                    });
                } else {
                    auth.signInWithEmailAndPassword(email, password)
                        .then((userCredentials) => {
                            const user = userCredentials.user;
                            console.log("Logged in with: ", user.email);
                        })
                        .catch((error) => {
                            console.log(error);
                            error.message =
                                "Password is incorrect. Please try again.";
                            return alert(error.message);
                        });
                }
            } else {
                navigation.navigate("CheckAccountScreen");
            }
        });
    };

    const handleLogin = () => {
        //moved Login check to be in the login button logic
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log("Logged in with: ", user);
                setStoreUser(user);
            })
            .catch((error) => {
                if (error.code === "auth/user-not-found") {
                    error.message =
                        "this user doesn't exist Would you like to register?";
                    return showAlert();
                }
                return alert(error.message);
            });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ImageBackground
                source={Background}
                resizeMode="cover"
                style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View style={styles.inputContainer}>
                    <Image
                        source={BeThereLogoExpanded}
                        style={{ height: 250, width: 250, alignSelf: "center" }}
                    />
                    <View style={{ justifyContent: "center" }}></View>
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
                    <TouchableOpacity
                        onPress={handleLogin}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSignUp}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
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
        backgroundColor: "#cb6ce6",
        width: "100%",
        padding: 15,
        margin: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonOutline: {
        backgroundColor: "transparent",
        marginTop: 5,
        borderColor: "white",
        borderWidth: 2,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    buttonOutlineText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
});
