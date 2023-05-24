// REACT IMPORTS
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
    Image,
    ImageBackground,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// FIREBASE IMPORTS
import { getDatabase, ref, update, child, get } from "firebase/database";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
const Background = require("../../../assets/Background.png");

const EditAccountScreen = (params) => {
    // COMPONENT VARIABLES
    const navigation = useNavigation();
    const r = useRoute();
    console.log("r -->", r);
    // STATE
    const [user, setUser] = useState(params.route.params);
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
    console.log("proPic -->", profilePic);
    // USEEFFECTS
    useEffect(() => {
        setUser(params.route.params);
    }, [params]);

    // FUNCTIONS
    const handleSubmit = async () => {
        if (firstName === "" || lastName === "" || email === "") {
            Alert.alert("Please provide your name and email");
            return;
        }
        try {
            const dbRef = ref(getDatabase());
            const userId = user.user_id;
            const userRef = child(dbRef, `users/${userId}`);
            const userSnapshot = await get(userRef);
            if (!userSnapshot.exists()) {
                throw new Error(`User with ID ${userId} does not exist`);
            }
            const updatedUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                homeCity: homeCity,
                profilePic: profilePic,
                dietary: dietary,
                accessibility: accessibility,
            };
            await update(userRef, updatedUser);
            navigation.navigate("MyAccountScreen", { user: updatedUser });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
            <ImageBackground
                source={Background}
                resizeMode="cover"
                style={styles.imageBG}
            >
                <ScrollView>
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>
                            Account Details
                        </Text>
                        <Text style={{ ...globalStyles.inputLabel }}>
                            First name:
                        </Text>
                        <TextInput
                            style={globalStyles.input}
                            placeholder={"First Name"}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <Text style={globalStyles.inputLabel}>Last name:</Text>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <Text style={globalStyles.inputLabel}>Email:</Text>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text style={globalStyles.inputLabel}>Phone:</Text>
                        <TextInput
                            style={globalStyles.input}
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
                        <Text style={globalStyles.inputLabel}>Address:</Text>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Home City"
                            value={homeCity}
                            onChangeText={setHomeCity}
                        />
                        <Text style={styles.sectionHeader}>
                            Edit Guest Profile
                        </Text>
                        <Text style={globalStyles.inputLabel}>
                            Dietary restrictions:
                        </Text>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Dietary"
                            value={dietary}
                            onChangeText={setDietary}
                        />
                        <Text style={globalStyles.inputLabel}>
                            Accessibility notes:
                        </Text>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Accessibility"
                            value={accessibility}
                            onChangeText={setAccessibility}
                        />
                        <SafeAreaView
                            style={{ alignItems: "center", marginTop: 20 }}
                        >
                            {profilePic ? (
                                <Image
                                    style={styles.profilePic}
                                    source={{
                                        uri: profilePic,
                                    }}
                                />
                            ) : null}
                            <TouchableOpacity
                                style={styles.changeProPicBtn}
                                onPress={() =>
                                    navigation.navigate(
                                        "UploadProfilePicScreen",
                                        { setProfilePic: setProfilePic, user: user }
                                    )
                                }
                            >
                                <Text style={styles.buttonText}>
                                    Change profile picture
                                </Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.updateBtn}
                            onPress={handleSubmit}
                            required={true}
                        >
                            <Text style={styles.buttonText}>
                                Update Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    section: {
        margin: 12,
    },
    profilePic: {
        width: 200,
        height: 200,
        borderRadius: 100,
        resizeMode: "cover",
    },
    sectionHeader: {
        ...globalStyles.heading2,
        margin: 20,
        textAlign: "center",
    },
    keyboardView: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    imageBG: {
        flex: 1,
        width: "100%",
    },
    changeProPicBtn: {
        ...globalStyles.button,
        backgroundColor: "#38b6ff",
    },
    buttonText: {
        ...globalStyles.paragraph,
        color: "white",
        fontWeight: "bold",
    },
    updateBtn: {
        ...globalStyles.button,
        backgroundColor: "#cb6ce6",
    },
});

export default EditAccountScreen;
