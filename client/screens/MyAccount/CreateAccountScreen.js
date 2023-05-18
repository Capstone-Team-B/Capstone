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
import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, update, set, child, get } from "firebase/database";
import globalStyles from "../../utils/globalStyles";

const dbRef = ref(getDatabase());

const CreateAccountScreen = (props) => {
    // finds the user in database if they were created by a host
    useEffect(() => {
        let uid = props.route.params.uid;
        if (uid !== "") {
            get(child(dbRef, `users/${uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const userRef = snapshot.val();
                    setUser(userRef);
                } else {
                    console.log("error reaching database");
                    props.route.params.uid = null;
                }
            });
        } else {
            return;
        }
    }, [props]);

    const [user, setUser] = useState({});

    //testing elements
    const [password, setPassword] = useState("pwpwpwpw" || "");
    const [confirmPassword, setConfirmPassword] = useState("pwpwpwpw" || "");

    // const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [email, setEmail] = useState(user.email || "");
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
    const [homeCity, setHomeCity] = useState(user.homeCity || "");
    const [profilePic, setProfilePic] = useState(user.profilePic || "");
    const [accessibility, setAccessibility] = useState(
        user.accessibility || ""
    );
    const [dietary, setDietary] = useState(user.dietary || "");

    //Pre fills in form if there is a uid
    useEffect(() => {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setPhoneNumber(user.phoneNumber || "");
        setHomeCity(user.homeCity || "");
        setProfilePic(user.profilePic || "");
        setAccessibility(user.accessibility || "");
        setDietary(user.dietary || "");
    }, [user]);

    const navigation = useNavigation();
    let errorFlag = false;

    const isConfirmedPassword = () => {
        if (password !== confirmPassword) {
            errorFlag = true;
            Alert.alert({
                message: "Passwoad and confirm password should be same.",
            });
        }
    };

    const handleSubmit = async () => {
        const uid = props.route.params.uid;
        // Check that Form was filled out with name and email
        isConfirmedPassword();
        console.log(errorFlag);
        if (firstName === "" || lastName === "" || email === "") {
            Alert.alert("Please provide your name and a contact method");
            return;
        }

        // Store the user data in the Realtime Database with the Authentication UID as the key for auth_id, user_id, guest_id if those don't exist
        let auth_id = "";
        // If existing user created by a host then update maintianing the guest_id value
        if (uid !== "") {
            try {
                const userRef = child(dbRef, `users/${uid}`);
                const userSnapshot = await get(userRef);
                if (userSnapshot.exists()) {
                    auth.createUserWithEmailAndPassword(email, password)
                        .then((userCredentials) => {
                            // set the auth id to match the credentials created in firebase authentication
                            auth_id = userCredentials.user.uid;
                        })
                        .then(() => {
                            const updateUser = {
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                phoneNumber: phoneNumber,
                                homeCity: homeCity,
                                profilePic: profilePic,
                                dietary: dietary,
                                accessibility: accessibility,
                                guest_id: uid,
                                auth_id: auth_id,
                            };
                            update(userRef, updateUser).then(() =>
                                navigation.navigate("LoginScreen")
                            );
                        });
                } else {
                    // set uid to "" empty string
                    uid = "";
                    //run handle submit again with new user logic
                    handleSubmit();
                }
            } catch (error) {
                console.log(error);
            }
        }
        // if uid is ""
        else {
            auth.createUserWithEmailAndPassword(email, password).then(
                (userCredentials) => {
                    // set the auth id to match the credentials created in firebase authentication
                    auth_id = userCredentials.user.uid;
                    let newUser = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phoneNumber: phoneNumber,
                        homeCity: homeCity,
                        profilePic: profilePic,
                        dietary: dietary,
                        accessibility: accessibility,
                        userEvents: {},
                        guest_id: auth_id,
                        user_id: auth_id,
                        auth_id: auth_id,
                    };
                    console.log("New user info -->", newUser);
                    const newUserRef = child(dbRef, `users/${auth_id}`);
                    console.log(newUserRef);
                    set(newUserRef, newUser).then(() =>
                        navigation.navigate("MyAccountScreen", {
                            uid: newUser.user_id,
                        })
                    );
                }
            );
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Create a Password</Text>
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                    <Text style={styles.sectionTitle}>Account Details</Text>

                    <TextInput
                        style={styles.input}
                        placeholder={"First Name"}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />
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
                    <TextInput
                        style={styles.input}
                        placeholder="Home City"
                        value={homeCity}
                        onChangeText={setHomeCity}
                    />
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Edit Guest Preferences
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dietary"
                            value={dietary}
                            onChangeText={setDietary}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Accessibility"
                            value={accessibility}
                            onChangeText={setAccessibility}
                        />
                    </View>
                    <SafeAreaView>
                        <Button
                            title="Upload Profile Picture"
                            onPress={() =>
                                navigation.navigate("UploadProfilePicScreen")
                            }
                        />
                    </SafeAreaView>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        required={true}
                    >
                        <Text style={styles.submitButtonText}>
                            Create Account
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

export default CreateAccountScreen;
