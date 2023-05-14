import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, child, set, push } from "firebase/database";

const CreateGuestList = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const [guestList, setGuestList] = useState([]);

    const eventId = event.event_id;

    const navigation = useNavigation();

    const handleAddGuest = () => {
        const newGuestList = [...guestList];
        newGuestList.push({ phone: "", firstname: "", lastname: "" });
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

    const handleSubmit = async () => {
        for (const guest of guestList) {
            if (!guest.phone || !guest.firstname || !guest.lastname) {
                Alert.alert("Please fill in all fields");
                return;
            }
        }

        const dbRef = ref(getDatabase());
        const usersRef = child(dbRef, `users`);
        const guestListRef = child(dbRef, `events/${eventId}/guestList`);

        for (const guest of guestList) {
            const {
                phone: guestPhone,
                firstname: guestFirstname,
                lastname: guestLastname,
            } = guest;
        
            const formattedPhone = guestPhone.replace(/\D/g, ''); 
            if (formattedPhone.length !== 10) {
                Alert.alert('Invalid phone number');
                return;
            }
            const newGuestListData = {
                phone: formattedPhone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
                firstName: guestFirstname,
                lastName: guestLastname,
                userEvents: {
                    [event.event_id]: event.event_id,
                },
            };
            const newGuestListRef = push(usersRef);
            await set(newGuestListRef, newGuestListData);
    
            const newGuestListKey = newGuestListRef.key;
            const newEventGuestsRef = push(guestListRef);
            await set(newEventGuestsRef, newGuestListKey);
        }
        navigation.navigate("SingleEvent", { event: event });
    }
    
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
                                    placeholder="Phone Number"
                                    value={guest.phone}
                                    onChangeText={(value) =>
                                        handleUpdateGuest(index, "phone", value)
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
                    <TouchableOpacity
                        style={styles.outlineButton}
                        onPress={() =>
                            navigation.navigate("Import Contacts", {
                                event: event,
                            })
                        }
                    >
                        <Text style={styles.outlineButtonText}>
                            Import from Contacts
                        </Text>
                    </TouchableOpacity>
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
}


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
