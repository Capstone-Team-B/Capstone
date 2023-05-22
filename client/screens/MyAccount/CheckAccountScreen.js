import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Image,
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
const BeThereLogoExpanded = require("../../../assets/BeThereExpanded.png");
const Background = require("../../../assets/Background.png");
import globalStyles from "../../utils/globalStyles";

const CheckAccountScreen = (props) => {
    const [user, setUser] = useState(props.route.params);
    const [email, setEmail] = useState(user.email || "");
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");

    useEffect(() => {
        setUser(props.route.params);
    }, [props]);

    const navigation = useNavigation();

    const handleSubmit = () => {
        //Make sure phone or email is entered to look up
        if (phoneNumber === "" && email === "") {
            Alert.alert(`Please provide an email or phone number`);
            return;
        }
        // check for matching phone number first
        const dbRef = ref(getDatabase());
        try {
            if (phoneNumber !== "") {
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
                                email: email,
                                phoneNumber: phoneNumber,
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
                                    email: email,
                                    phoneNumber: phoneNumber,
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
                                    Alert.alert(
                                        "Your Host made an account. Let's update it."
                                    );
                                    navigation.navigate("CreateAccountScreen", {
                                        uid: uid,
                                        email: email,
                                        phoneNumber: phoneNumber,
                                    });
                                } else {
                                    console.log("No email found");
                                    Alert.alert(
                                        "No matching account. Let's create one"
                                    );
                                    navigation.navigate("CreateAccountScreen", {
                                        uid: "",
                                        email: email,
                                        phoneNumber: phoneNumber,
                                    });
                                }
                            });
                            Alert.alert(
                                "No matching account. Let's create one"
                            );
                            navigation.navigate("CreateAccountScreen", {
                                uid: "",
                                email: email,
                                phoneNumber: phoneNumber,
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("line 105", error);
                    });
            } else {
                //now should check for email not there go to create account
                if (email === "") {
                    Alert.alert("No matching account. Let's create one");

                    navigation.navigate("CreateAccountScreen", {
                        uid: "",
                        email: email,
                        phoneNumber: phoneNumber,
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
                        Alert.alert(
                            "Your Host made an account. Let's update it."
                        );
                        navigation.navigate("CreateAccountScreen", {
                            uid: uid,
                            email: email,
                            phoneNumber: phoneNumber,
                        });
                    } else {
                        console.log("No email found");
                        Alert.alert("No matching account. Let's create one");
                        navigation.navigate("CreateAccountScreen", {
                            uid: "",
                            email: email,
                            phoneNumber: phoneNumber,
                        });
                    }
                });
                Alert.alert("No matching account. Let's create one");
                navigation.navigate("CreateAccountScreen", {
                    uid: "",
                    email: email,
                    phoneNumber: phoneNumber,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSkip = async () => {
        navigation.navigate("CreateAccountScreen", {
            uid: "",
            email: email,
            phoneNumber: phoneNumber,
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
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
                <Text style={styles.sectionTitle}>Checking for Account</Text>
                <View style={styles.inputContainer}>
                    <Image
                        source={BeThereLogoExpanded}
                        style={{ height: 200, width: 200, alignSelf: "center" }}
                    />

                    {/* <Text style={globalStyles.heading3}>Email: </Text> */}
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {/* <Text style={globalStyles.heading3}>Phone number: </Text> */}
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={(phoneNumber) =>
                            setPhoneNumber(
                                phoneNumber.replace(
                                    /(\d{3})(\d{3})(\d{4})/,
                                    "($1) $2-$3"
                                )
                            )
                        }
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        required={true}
                    >
                        <Text style={styles.buttonText}>Check for Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonOutline]}
                        onPress={handleSkip}
                        required={true}
                    >
                        <Text style={styles.submitButtonText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        width: "80%",
    },
    sectionTitle: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 0,
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
    },

    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    inputContainer: {
        width: "80%",
    },

    buttonContainer: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
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

export default CheckAccountScreen;
