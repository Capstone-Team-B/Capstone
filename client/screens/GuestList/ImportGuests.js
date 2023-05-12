import React, { useState, useEffect, useCallback } from "react";
import {
    KeyboardAvoidingView,
    StatusBar,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, child, set, push } from "firebase/database";
import * as Contacts from "expo-contacts";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const ImportContacts = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const [guestList, setGuestList] = useState([]);
    const [error, setError] = useState(undefined);
    const [contacts, setContacts] = useState(undefined);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [checks, setChecks] = useState([]);

    const handleSelectAll = useCallback(() => {
        setToggleCheckBox((previous) => !previous);

        if (!toggleCheckBox) {
            setSelectedContacts([...contacts]);
            setChecks(contacts.map(() => true)); // select all checkboxes
        } else {
            setSelectedContacts([]);
            setChecks(contacts.map(() => false)); // deselect all checkboxes
        }
    }, [toggleCheckBox, contacts, setSelectedContacts, setChecks]);

    useEffect(() => {
        if (!contacts) {
            return;
        }
        if (toggleCheckBox) {
            setSelectedContacts(contacts);
            setChecks(contacts.map(() => true));
        } else {
            setChecks(contacts.map(() => false));
        }
    }, [toggleCheckBox, contacts, setSelectedContacts, setChecks]);

    const onCheck = useCallback(
        (index) => {
            let previous = [...checks];
            previous[index] = !previous[index];
            setChecks(previous);

            let newSelectedContacts = [];
            for (let i = 0; i < previous.length; i++) {
                if (previous[i]) {
                    newSelectedContacts.push(contacts[i]);
                }
            }
            setSelectedContacts(newSelectedContacts);
        },
        [checks, contacts, setSelectedContacts, setChecks]
    );

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Contacts.requestPermissionsAsync();
                if (status === "granted") {
                    const { data } = await Contacts.getContactsAsync({
                        fields: [
                            Contacts.Fields.Emails,
                            Contacts.Fields.FirstName,
                            Contacts.Fields.LastName,
                            Contacts.Fields.PhoneNumbers,
                        ],
                    });

                    if (data.length > 0) {
                        setContacts(data);
                        setChecks(
                            Array.from({ length: data.length }, () => false)
                        );
                    } else {
                        setError("No contacts found");
                    }
                } else {
                    setError("Permission to access contacts denied.");
                }
            } catch (error) {
                console.error(error);
                setError("An error occurred while fetching contacts.");
            }
        })();
    }, []);

    const handleSubmit = async () => {
        const dbRef = ref(getDatabase());
        const guestListRef = child(dbRef, "guestlist");

        for (const guest of guestList) {
            const {
                email: guestEmail,
                firstname: guestFirstname,
                lastname: guestLastname,
            } = guest;
            const newGuestListData = {
                email: guestEmail,
                firstname: guestFirstname,
                lastname: guestLastname,
                role: "Guest",
                event_id: event.id,
            };

            const newGuestListRef = push(guestListRef);
            await set(newGuestListRef, newGuestListData);
        }
        navigation.navigate("SingleEvent", { event: event });
    };

    const getContactData = (data, property, label) => {
        if (data) {
            return data.map((data, index) => {
                return (
                    <View key={index}>
                        <Text>
                            {label}: {data[property]}
                        </Text>
                    </View>
                );
            });
        }
    };

    const getContactRows = () => {
        if (contacts !== undefined) {
            return contacts.map((contact, index) => {
                return (
                    <View key={index}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                            }}
                        >
                            <BouncyCheckbox
                                isChecked={checks[index]}
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) =>
                                    setToggleCheckBox(newValue)
                                }
                                onPress={() => onCheck(index)}
                                disableBuiltInState={true}
                            />
                            <Text style={{ flexWrap: "wrap" }}>
                                Name: {contact.firstName} {contact.lastName}
                                {"\n"}
                                {getContactData(
                                    contact.phoneNumbers,
                                    "number",
                                    "Phone Number"
                                )}
                                {"\n"}
                                {getContactData(
                                    contact.emails,
                                    "email",
                                    "Email"
                                )}
                            </Text>
                        </View>
                    </View>
                );
            });
        } else {
            return <Text>Loading contacts...</Text>;
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Imported Contacts</Text>
                    <TouchableOpacity
                        style={styles.outlineButton}
                        onPress={handleSelectAll}
                    >
                        <Text style={styles.outlineButtonText}>
                            {checks.every(Boolean)
                                ? "Deselect All"
                                : "Select All"}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.section}>
                        <Text>{error}</Text>
                        {getContactRows()}
                        <StatusBar style="auto" />
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>
                            Save Updates
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

export default ImportContacts;
