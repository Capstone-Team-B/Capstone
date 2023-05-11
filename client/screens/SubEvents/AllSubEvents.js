import React, { useState, useEffect } from "react";
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
import { getDatabase, ref, child, get } from "firebase/database";

const AllSubEvents = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const [subEvent, setSubEvent] = useState([]);
    const navigation = useNavigation();
    const dbRef = ref(getDatabase());

    useEffect(() => {
        const subEventSnapshot = get(child(dbRef, `subevents`));
        console.log(subEventSnapshot);
        if (!subEventSnapshot) {
            console.log("no subevents found");
        } else {
            const data = subEventSnapshot;
            const subEventList = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
            }));
            const filteredSubEvent = subEventList.filter(
                (subEvent) => subEvent.event_id === event.id
            );
            setSubEvent(filteredSubEvent);
        }
    }, []);

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    {subEvent.length > 0 ? (
                        subEvent.map((subEvent) => (
                            <View key={subEvent.id} style={styles.item}>
                                <Text style={styles.input}>
                                    Event Name: {subEvent.name}
                                </Text>
                                <Text style={styles.input}>
                                    Location: {subEvent.location}
                                </Text>
                                <Text style={styles.input}>
                                    Time:{" "}
                                    {new Date(
                                        subEvent.startTime
                                    ).toLocaleTimeString()}{" "}
                                    -{" "}
                                    {new Date(
                                        subEvent.endTime
                                    ).toLocaleTimeString()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text>No subevents found</Text>
                    )}
                    <View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() =>
                                navigation.navigate("Create Sub Event", {
                                    event: event,
                                })
                            }
                        >
                            <Text style={styles.addButtonText}>
                                Create New Sub Event
                            </Text>
                        </TouchableOpacity>
                    </View>
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

export default AllSubEvents;
