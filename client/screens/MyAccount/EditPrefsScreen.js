import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
// import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, update, set } from "firebase/database";

const EditPreferencesScreen = (props) => {
    const [user, setUser] = useState(props.route.params);
    console.log(user);
    const [accessibility, setAccessibility] = useState(
        user.accessibility || ""
    );
    const [dietary, setDietary] = useState("");
    // OTHER INFO AND ALLERGIES MAY ADD BACK IN///
    // const [otherInfo, setOtherInfo] = useState("");
    // <TextInput
    //     style={styles.input}
    //     placeholder="Other Information"
    //     value={otherInfo}
    //     onChangeText={setOtherInfo}
    // />;
    // const [allergies, setAllergies] = useState("");
    // <TextInput
    //     style={styles.input}
    //     placeholder="Allergies"
    //     value={allergies}
    //     onChangeText={setAllergies}
    // />;

    useEffect(() => {
        setUser(props.route.params);
    }, [props]);

    const navigation = useNavigation();

    const handleSubmit = async () => {
        try {
            //TODO COMMENT BACK IN //

            // const dbRef = ref(getDatabase());
            // const userId = user.id;
            // const userRef = child(dbRef, `users/${userId}`);
            // const userSnapshot = await get(userRef);
            // if (!userSnapshot.exists()) {
            //     throw new Error(`Event with ID ${userId} does not exist`);
            // }
            const updatedPrefs = {
                dietary: dietary,
                accessibility: accessibility,
            };
            //TODO COMMENT BACK IN //
            // await update(userRef, updatedPrefs)
            navigation.navigate("MyAccountScreen");
            console.log("updates to user", updatedPrefs);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Dietary"
                        value={dietary}
                        onChangeText={setDietary}
                        // required={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Accessibility"
                        value={accessibility}
                        onChangeText={setAccessibility}
                        // required={true}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        required={true}
                    >
                        <Text style={styles.submitButtonText}>
                            Update Preferences
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

export default EditPreferencesScreen;
