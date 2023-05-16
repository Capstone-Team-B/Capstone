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
import { getDatabase, ref, update, set, child, get } from "firebase/database";

const CreateAccountScreen = (props) => {
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

    useEffect(() => {
        setUser(props.route.params);
    }, [props]);

    const navigation = useNavigation();

    const handleSubmit = async () => {
        console.log("user updates", user);
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
            console.log("updates to user", updatedUser);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
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
                            Update Account
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
