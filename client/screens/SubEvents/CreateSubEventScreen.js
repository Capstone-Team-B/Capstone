import React, { useState, useCallback } from "react";
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
import { getDatabase, ref, child, push, set } from "firebase/database";
import { DatePickerModal } from "react-native-paper-dates";
import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const CreateSubEvent = (params) => {
    const [event, setEvent] = useState(params.route.params.event);

    const [subEvent, setSubEvent] = useState({
        name: "",
        location: "",
        date: null,
        startTime: null,
        endTime: null,
    });
    const [selectedEventType, setSelectedEventType] = useState(null);
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const navigation = useNavigation();

    const onDismiss = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleTimeConfirm = (selectedTime) => {
        const date = new Date();
        date.setHours(selectedTime.hours);
        date.setMinutes(selectedTime.minutes);
        const formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        let newSubEvent = { ...subEvent };
        const eventType = selectedEventType;
        if (eventType === "start") {
            newSubEvent.startTime = formattedTime;
        } else if (eventType === "end") {
            newSubEvent.endTime = formattedTime;
        }

        setSubEvent(newSubEvent);
        setVisible(false);
    };

    const handleDeleteSubEvent = () => {
        setSubEvent({});
        navigation.navigate("All Sub Events", { event: event });
    };

    const handleUpdateSubEvent = (field, value) => {
        setSubEvent((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (
            !subEvent.name ||
            !subEvent.location ||
            !subEvent.date ||
            !subEvent.startTime ||
            !subEvent.endTime
        ) {
            Alert.alert("Please fill in all fields");
            return;
        }

        const dbRef = ref(getDatabase());
        const subeventRef = child(dbRef, "subevent");
        const tagRef = child(dbRef, "tags");

        // Create a new subevent and associate it with a tag
        const {
            name: subeventName,
            location: subeventLocation,
            date: subeventDate,
            startTime: subeventtartTime,
            endTime: subeventEndTime,
        } = subEvent;
        const newSubEventData = {
            name: subeventName,
            location: subeventLocation,
            date: subeventDate,
            startTime: subeventtartTime,
            endTime: subeventEndTime,
            event_id: event.id,
        };

        // Create a new tag with the subevent name
        const newTagData = { name: subeventName };
        const newTagRef = push(tagRef);
        const newTagKey = newTagRef.key;
        await set(newTagRef, newTagData);

        // Create a new subevent and associate it with the new tag
        const newSubEventWithTagData = {
            tag_id: newTagKey,
            ...newSubEventData,
        };
        const newSubEventRef = push(subeventRef);
        await set(newSubEventRef, newSubEventWithTagData);

        navigation.navigate("All Sub Events", { event: event });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sub-Events</Text>
                    <View style={styles.section}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={subEvent.name}
                            onChangeText={(value) =>
                                handleUpdateSubEvent("name", value)
                            }
                            required={true}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Location"
                            value={subEvent.location}
                            onChangeText={(value) =>
                                handleUpdateSubEvent("location", value)
                            }
                            required={true}
                        />
                        <TouchableOpacity style={styles.outlineButton}>
                            <TouchableOpacity onPress={() => setOpen(true)}>
                                <Text style={styles.outlineButtonText}>
                                    {subEvent.date
                                        ? new Date(
                                              subEvent.date
                                          ).toLocaleDateString("en-US", {
                                              weekday: "short",
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : "Select Date"}
                                </Text>
                            </TouchableOpacity>
                            <SafeAreaProvider>
                                <DatePickerModal
                                    locale="en"
                                    mode="single"
                                    visible={open}
                                    onDismiss={onDismissSingle}
                                    date={subEvent.date}
                                    onConfirm={(selectedDate) => {
                                        handleUpdateSubEvent(
                                            "date",
                                            selectedDate.date
                                        );
                                        setOpen(false);
                                    }}
                                    saveLabel="Save"
                                    required={true}
                                />
                            </SafeAreaProvider>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.outlineButton}
                            required={true}
                            onPress={() => {
                                setVisible(true);
                                setSelectedEventType("start");
                            }}
                        >
                            <Text style={styles.outlineButtonText}>
                                {subEvent.startTime
                                    ? subEvent.startTime
                                    : "Select Start Time"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.outlineButton}
                            required={true}
                            onPress={() => {
                                setVisible(true);
                                setSelectedEventType("end");
                            }}
                        >
                            <Text style={styles.outlineButtonText}>
                                {subEvent.endTime
                                    ? subEvent.endTime
                                    : "Select End Time"}
                            </Text>
                        </TouchableOpacity>
                        <SafeAreaProvider>
                            <TimePickerModal
                                visible={visible}
                                mode="time"
                                onConfirm={(time) => handleTimeConfirm(time)}
                                onDismiss={onDismiss}
                                hours={12}
                                minutes={30}
                                required={true}
                            />
                        </SafeAreaProvider>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteSubEvent()}
                        >
                            <Text style={styles.deleteButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>
                            Create Sub-Event
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

export default CreateSubEvent;
