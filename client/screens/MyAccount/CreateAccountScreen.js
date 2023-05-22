import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ImageBackground,
} from "react-native";
import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, update, set, child, get } from "firebase/database";
import globalStyles from "../../utils/globalStyles";
const Background = require("../../../assets/Background.png");

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

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [email, setEmail] = useState(
        user.email || props.route.params.email || ""
    );
    const [phoneNumber, setPhoneNumber] = useState(
        user.phoneNumber || props.route.params.phoneNumber || ""
    );
    const [homeCity, setHomeCity] = useState(user.homeCity || "");

    //Pre fills in form if there is a uid
    useEffect(() => {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        if (email === " ") {
            setEmail(user.email || "");
        }
        if (phoneNumber === " ") {
            setPhoneNumber(user.phoneNumber || "");
        }
        setHomeCity(user.homeCity || "");
    }, [user]);

    const navigation = useNavigation();
    // let errorFlag = false;

    const isConfirmedPassword = () => {
        console.log("checking password");
        if (password !== confirmPassword) {
            console.log("password not matching");
            return false;
        } else {
            return true;
        }
    };

    const handleSubmit = async () => {
        const uid = props.route.params.uid;
        // Check that Form was filled out with name and email
        const checkingPassword = isConfirmedPassword();
        if (!checkingPassword) {
            Alert.alert("Password and confirm password should be same.");
            return;
        }
        // console.log(errorFlag);
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
                        user_id: auth_id,
                        auth_id: auth_id,
                    };
                    const newUserRef = child(dbRef, `users/${auth_id}`);
                    set(newUserRef, newUser).then((newUser) =>
                        navigation.navigate("MyAccountScreen", {
                            uid: newUser.user_id,
                            // uid: newUser.user_id,
                        })
                    );
                }
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: "#fff",
                justifyContent: "center",
            }}
            behavior="height"
        >
            <ImageBackground
                source={Background}
                resizeMode="cover"
                style={{
                    flex: 1,
                    width: "100%",
                }}
            >
                <ScrollView>
                    <View style={{ margin: 25 }}>
                        <Text
                            style={{
                                ...globalStyles.heading2,
                                marginBottom: 20,
                                textAlign: "center",
                            }}
                        >
                            Create a Password
                        </Text>
                        <TextInput
                            placeholder="Password (Required)"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            style={globalStyles.inputAccount}
                            secureTextEntry
                        />
                        <TextInput
                            placeholder="Confirm Password (Required)"
                            value={confirmPassword}
                            onChangeText={(text) => setConfirmPassword(text)}
                            style={globalStyles.inputAccount}
                            secureTextEntry
                        />
                        <Text
                            style={{
                                ...globalStyles.heading2,
                                margin: 20,
                                textAlign: "center",
                            }}
                        >
                            Account Details
                        </Text>

                        <TextInput
                            style={globalStyles.inputAccount}
                            placeholder={"First Name (Required)"}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            style={globalStyles.inputAccount}
                            placeholder="Last Name (Required)"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <TextInput
                            style={globalStyles.inputAccount}
                            placeholder="Email (Required)"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={globalStyles.inputAccount}
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                        <TextInput
                            style={globalStyles.inputAccount}
                            placeholder="Home City"
                            value={homeCity}
                            onChangeText={setHomeCity}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            style={{
                                ...globalStyles.button,
                                backgroundColor: "#ad6ce6",
                            }}
                            onPress={handleSubmit}
                            required={true}
                        >
                            <Text
                                style={{
                                    ...globalStyles.paragraph,
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            >
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default CreateAccountScreen;
