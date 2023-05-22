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
import { useNavigation } from "@react-navigation/native";
import {
    getDatabase,
    ref,
    child,
    get,
    orderByChild,
    equalTo,
    query,
} from "firebase/database";
import { useAtom } from "jotai";
import { user as userStore } from "../store/user";
const BeThereLogoExpanded = require("../../assets/BeThereExpanded.png");
const Background = require("../../assets/Background.png");

const LoginScreen = () => {
    // logging in as kit, who is the host of an event
    // const [email, setEmail] = useState("kit@kit.com");
    // const [password, setPassword] = useState("pwpwpw");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [storeUser, setStoreUser] = useAtom(userStore);
    console.log("jotai userStore", storeUser);
    const navigation = useNavigation();

    const showAlert = () => {
        return Alert.alert(
            "User Not Found",
            "Would you like to create a BeThere account?",
            [
                {
                    text: "Yes Please",
                    // need to go to the check for user
                    onPress: () =>
                        navigation.navigate("CheckAccountScreen", {
                            screen: "CheckAccountScreen",
                            email: email || "",
                        }),
                    //navigation()
                },
                {
                    text: "No Thank you",
                    onPress: () => Alert.alert("Maybe another time then."),
                },
            ]
        );
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            const getUserId = async (uid) => {
                const dbRef = ref(getDatabase());
                const usersQuery = query(
                    child(dbRef, "users"),
                    orderByChild("auth_id"),
                    equalTo(uid)
                );
                const snapshot = await get(usersQuery);

                if (snapshot.exists()) {
                    const data = Object.keys(snapshot.val());
                    setUserId(data[0]);
                    // setStoreUser(data);
                }
            };

            if (user) {
                getUserId(user.uid);
                navigation.navigate("TabNav", {
                    screen: "EventNavigator",
                    uid: userId,
                });
                return;
            }
        });
        return unsubscribe;
    }, [handleLogin]);

    const handleSignUp = () => {
        // if the email is blank then check for an account
        if (email === "") {
            navigation.navigate("CheckAccountScreen", { email: "" });
            return;
        }

        const dbRef = ref(getDatabase());
        // Check if the email entered during registration already exists in the database
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists) {
                const data = snapshot.val();
                const existingUser = Object.keys(data).find(
                    (key) => data[key].email === email
                );
                if (!existingUser) {
                    console.log("no existing user", email);
                    navigation.navigate("CheckAccountScreen", {
                        email: email || "",
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
                                "This email is registered to an account. Please enter the password.";
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
                // console.log("Logged in with: ", user);
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
