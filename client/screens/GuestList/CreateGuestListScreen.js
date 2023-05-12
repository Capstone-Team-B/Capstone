import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    StatusBar,
    Alert,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, child, set, push } from "firebase/database";
import * as Contacts from "expo-contacts";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const CreateGuestList = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const [guestList, setGuestList] = useState([]);
    const [error, setError] = useState(undefined);
    const [contacts, setContacts] = useState(undefined);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    const navigation = useNavigation();

    const handleAddGuest = () => {
        const newGuestList = [...guestList];
        newGuestList.push({ email: "", name: "" });
        setGuestList(newGuestList);
    };

    const handleDeleteGuest = (index) => {
        const newGuestList = [...guestList];
        newGuestList.splice(index, 1);
        setGuestList(newGuestList);
    };

    const handleUpdateGuest = (index, field, value) => {
        const newGuestList = [...guestList];
        newGuestList[index][field] = value;
        setGuestList(newGuestList);
    };

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
        for (const guest of guestList) {
            if (!guest.email || !guest.firstname || !guest.lastname) {
                Alert.alert("Please fill in all fields");
                return;
            }
        }

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
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) =>
                                    setToggleCheckBox(newValue)
                                }
                            />
                            <Text style={{ flexWrap: "wrap" }}>
                                Name: {contact.firstName} {contact.lastName}{'\n'}
                            {getContactData(
                                contact.phoneNumbers,
                                "number",
                                "Phone Number"
                            )}{'\n'}
                            {getContactData(contact.emails, "email", "Email")}
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
                    <Text style={styles.sectionTitle}>Guest List</Text>
                    <View style={styles.section}>
                        {guestList.map((guest, index) => (
                            <View style={styles.section} key={index}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="First Name"
                                    value={guest.firstname}
                                    onChangeText={(value) =>
                                        handleUpdateGuest(
                                            index,
                                            "firstname",
                                            value
                                        )
                                    }
                                    required={true}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Last Name"
                                    value={guest.lastname}
                                    onChangeText={(value) =>
                                        handleUpdateGuest(
                                            index,
                                            "lastname",
                                            value
                                        )
                                    }
                                    required={true}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email address"
                                    value={guest.email}
                                    onChangeText={(value) =>
                                        handleUpdateGuest(index, "email", value)
                                    }
                                    required={true}
                                />
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteGuest(index)}
                                >
                                    <Text style={styles.deleteButtonText}>
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.outlineButton}>
                        <Text style={styles.outlineButtonText}>
                            Upload from Contacts
                        </Text>
                    </TouchableOpacity>
                    <View>
                        <Text>{error}</Text>
                        {getContactRows()}
                        <StatusBar style="auto" />
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddGuest}
                    >
                        <Text style={styles.addButtonText}>
                            Add Guest Manually
                        </Text>
                    </TouchableOpacity>
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

export default CreateGuestList;
