import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Alert,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import {
    getDatabase,
    ref,
    child,
    set,
    push,
    get,
    equalTo,
    query,
    orderByChild,
} from "firebase/database";

const EditAccountScreen = ({ route }) => {
    const { params } = route;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [accomodations, setAccomodations] = useState("");
    const [allergies, setAllergies] = useState("");
    const [dietRestrictions, setDietRestrictions] = useState("");
    const [otherInfo, setOtherInfo] = useState("");

    useEffect(() => {
        setFirstName(params.firstName);
        setLastName(params.lastName);
        setEmail(params.email);
        setPhoneNumber(params.phoneNumber);
        setAccomodations(params.accomodations);
        setAllergies(params.allergies);
        setDietRestrictions(params.dietRestrictions);
        setOtherInfo(params.otherInfo);
    }, [params]);

    const navigation = useNavigation();

    const dbRef = ref(getDatabase());
    const db = getDatabase();
    let idTest = 1;
    const handleSubmit = async () => {
        console.log("submitted");
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={params.firstName}
                        value={firstName}
                        onChangeText={setFirstName}
                        required={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        required={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        required={true}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        // required={true}
                    />

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
                        placeholder="Accomodations"
                        value={accomodations}
                        onChangeText={setAccomodations}
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

export default EditAccountScreen;
