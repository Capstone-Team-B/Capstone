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
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, update, child, get } from "firebase/database";
import globalStyles from "../../utils/globalStyles";
import * as ImagePicker from "expo-image-picker";
const Background = require("../../../assets/Background.png");

// import { auth } from "../../../firebase";

const EditAccountScreen = (props) => {
    // STATE
    const [user, setUser] = useState(props.route.params);
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

    // COMPONENT VARIABLES
    const navigation = useNavigation();

    useEffect(() => {
        setUser(props.route.params);
    }, [props]);

    // FUNCTIONS
    const handleSubmit = async () => {
        if (firstName === "" || lastName === "" || email === "") {
            Alert.alert("Please provide your name and email");
            return;
        }
        try {
            const dbRef = ref(getDatabase());
            const userId = user.uid;
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
                    <View style={styles.section}>
                        <Text
                            style={{
                                ...globalStyles.heading2,
                                margin: 20,
                                textAlign: "center",
                            }}
                        >
                            Account Details
                        </Text>
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                                marginLeft: 8,
                            }}
                        >
                            First name:
                        </Text>
                        <TextInput
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
                            placeholder={"First Name"}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                                marginLeft: 8,
                            }}
                        >
                            Last name:
                        </Text>
                        <TextInput
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                                marginLeft: 8,
                            }}
                        >
                            Email:
                        </Text>
                        <TextInput
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                                marginLeft: 8,
                            }}
                        >
                            Phone:
                        </Text>
                        <TextInput
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                                marginLeft: 8,
                            }}
                        >
                            Address:
                        </Text>
                        <TextInput
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
                            placeholder="Home City"
                            value={homeCity}
                            onChangeText={setHomeCity}
                        />
                        <View style={styles.section}>
                            <Text
                                style={{
                                    ...globalStyles.heading2,
                                    margin: 20,
                                    textAlign: "center",
                                }}
                            >
                                Edit Guest Profile
                            </Text>
                            <Text
                                style={{
                                    ...globalStyles.paragraph,
                                    marginBottom: 12,
                                    marginLeft: 8,
                                }}
                            >
                                Dietary restrictions:
                            </Text>
                            <TextInput
                                style={{
                                    ...globalStyles.input,
                                    backgroundColor: "white",
                                }}
                                placeholder="Dietary"
                                value={dietary}
                                onChangeText={setDietary}
                            />
                            <Text
                                style={{
                                    ...globalStyles.paragraph,
                                    marginBottom: 12,
                                    marginLeft: 8,
                                }}
                            >
                                Accessibility notes:
                            </Text>
                            <TextInput
                                style={{
                                    ...globalStyles.input,
                                    backgroundColor: "white",
                                }}
                                placeholder="Accessibility"
                                value={accessibility}
                                onChangeText={setAccessibility}
                            />
                        </View>
                        <SafeAreaView style={{ alignItems: "center" }}>
                            {profilePic ? (
                                <Image
                                    style={styles.profilePic}
                                    source={{
                                        uri: profilePic,
                                    }}
                                />
                            ) : null}
                            <TouchableOpacity
                                style={{
                                    ...globalStyles.button,
                                    backgroundColor: "#38b6ff",
                                }}
                                onPress={() =>
                                    navigation.navigate(
                                        "UploadProfilePicScreen",
                                        {
                                            uid: user.user_id,
                                        }
                                    )
                                }
                            >
                                <Text
                                    style={{
                                        ...globalStyles.paragraph,
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Change profile picture
                                </Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={{
                                ...globalStyles.button,
                                backgroundColor: "#cb6ce6",
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
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        margin: 12,
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
    profilePic: {
        width: 200,
        height: 200,
        borderRadius: 100,
        resizeMode: "cover",
    },
});

export default EditAccountScreen;
