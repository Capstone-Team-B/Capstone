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

const EditPrefsScreen = ({ route }) => {
    const [user, setUser] = useState(route.params.user);
    console.log(user);
    const [accessibility, setAccessibility] = useState("");
    const [allergies, setAllergies] = useState("");
    const [dietRestrictions, setDietRestrictions] = useState("");
    const [otherInfo, setOtherInfo] = useState("");

    useEffect(() => {
        console.log("useEffect active");
        console.log("params are the user object", params);
        // move to prefs page.
        setAccessibility(params.accessibility);
        setAllergies(params.allergies);
        setDietRestrictions(params.dietRestrictions);
        setOtherInfo(params.otherInfo);
    }, [params]);

    const navigation = useNavigation();

    const dbRef = ref(getDatabase());
    const db = getDatabase();
    const handleSubmit = async () => {
        const currentTime = new Date().toISOString();
        console.log("currentTime", currentTime);
        console.log(allergies);
        // set(ref(db), `users/${params.id}`, {
        //     firstName: firstName,
        // })
        //     .then(() => {
        //         console.log("updated");
        //     })
        //     .catch((error) => {
        //         console.log("whoops", error);
        //     });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prefs Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Allergies"
                        value={allergies}
                        onChangeText={setAllergies}
                        // required={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Diet Restrictions"
                        value={dietRestrictions}
                        onChangeText={setDietRestrictions}
                        // required={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="accessibility"
                        value={accessibility}
                        onChangeText={setAccessibility}
                        // required={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Other Information"
                        value={otherInfo}
                        onChangeText={setOtherInfo}
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
                            Update Prefs
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

export default EditPrefsScreen;
