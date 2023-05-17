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
import { getDatabase, ref, child, set, push, update, get, query } from "firebase/database";

const CreateGuestList = (params) => {
    const [guestList, setGuestList] = useState([]);
    const event = params.route.params.event;
    const eventId = event.event_id;
    const navigation = useNavigation();

    const handleAddGuest = () => {
        const newGuestList = [...guestList];
        newGuestList.push({ phoneNumber: "", email: "", firstName: "", lastName: "" });
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
            if (!guest.phoneNumber || !guest.firstName || !guest.lastName) {
              Alert.alert("Please fill in all required fields");
              return;
            }
          }
          
          const dbRef = ref(getDatabase());
          const usersRef = child(dbRef, `users`);
          const guestListRef = child(dbRef, `events/${eventId}/guestList`);
          
          for (const guest of guestList) {
            const {
              phoneNumber: guestPhone,
              email: guestEmail,
              firstName: guestFirstname,
              lastName: guestLastname,
            } = guest;
          
            const formattedPhone = guestPhone.replace(/\D/g, "");
            if (formattedPhone.length !== 10) {
              Alert.alert("Invalid phone number");
              return;
            }
          
            const newGuestListData = {
              phoneNumber: formattedPhone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
              email: guestEmail,
              firstName: guestFirstname,
              lastName: guestLastname,
              userEvents: {
                event_id: event.event_id,
              }
            };
          
            try {
              const query = query(usersRef, orderByChild("phoneNumber").equalTo(formattedPhone));
              const snapshot = await get(query);
          
              if (snapshot.exists()) {
                const userData = snapshot.val();
                newGuestListData.user_id = userData.user_id;
            
                const newEventGuestsRef = child(guestListRef, userData.user_id);
                await update(newEventGuestsRef, { guest_id: userData.user_id });

              } else {
                const newGuestListRef = push(usersRef);
                const newGuestListKey = newGuestListRef.key;
                newGuestListData.user_id = newGuestListKey;

                await set(newGuestListRef, newGuestListData);
            
                const newEventGuestsRef = child(guestListRef, newGuestListKey);
                await update(newEventGuestsRef, { guest_id: newGuestListKey });
              }
            } catch (error) {
              console.log("Error:", error);
              Alert.alert("Something went wrong, please try again.");
            }
          }
          
        navigation.navigate("SingleEvent", { event: event });
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
                                    placeholder="First name"
                                    value={guest.firstName}
                                    onChangeText={(value) =>
                                        handleUpdateGuest(
                                            index,
                                            "firstName",
                                            value
                                        )
                                    }
                                    required={true}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Last name"
                                    value={guest.lastName}
                                    onChangeText={(value) =>
                                        handleUpdateGuest(
                                            index,
                                            "lastName",
                                            value
                                        )
                                    }
                                    required={true}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone number"
                                    value={guest.phoneNumber}
                                    onChangeText={(value) =>
                                        handleUpdateGuest(index, "phoneNumber", value)
                                    }
                                    required={true}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email address (optional)"
                                    value={guest.email}
                                    onChangeText={(value) =>
                                        handleUpdateGuest(index, "email", value)
                                    }
                                    required={false}
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
                <View>
                <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {navigation.navigate("GuestListScreen", { event: event })}}
                    >
                        <Text style={styles.addButtonText}>
                            View All Guests
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
