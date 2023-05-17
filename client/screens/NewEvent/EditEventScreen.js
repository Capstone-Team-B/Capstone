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
import { getDatabase, ref, child, update, get } from "firebase/database";
import { DatePickerModal } from "react-native-paper-dates";
import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const EditEvent = (params) => {
    const [event, setEvent] = useState(params.route.params.event);

    const [weddingName, setWeddingName] = useState(event.name || "");
    const [eventStartDate, setEventStartDate] = useState(
        new Date(event.startDate) || ""
    );
    const [eventEndDate, setEventEndDate] = useState(
        new Date(event.endDate) || ""
    );
    const [description, setDescription] = useState(event.description || "");
    const [startTime, setStartTime] = useState(event.startTime || "");
    const [endTime, setEndTime] = useState(event.endTime || "");
    const [location, setLocation] = useState(event.mainLocation || "");
    const [selectedEventType, setSelectedEventType] = useState("");
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const onDismiss = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onDismissRange = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirmRange = useCallback(
        ({ startDate, endDate }) => {
            setOpen(false);
            setEventStartDate(startDate.toISOString());
            setEventEndDate(endDate.toISOString());
            setEvent((prevEvent) => ({
                ...prevEvent,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            }));
        },
        [setOpen, setEventEndDate, setEventStartDate]
    );

    const navigation = useNavigation();

    const handleTimeConfirm = (selectedTime) => {
        const date = new Date();
        date.setHours(selectedTime.hours);
        date.setMinutes(selectedTime.minutes);
        const formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        if (selectedEventType === "start") {
            setStartTime(formattedTime);
        } else if (selectedEventType === "end") {
            setEndTime(formattedTime);
        }
        setVisible(false);
    };

    const handleSubmit = async () => {
        if (
            !weddingName ||
            !eventStartDate ||
            !eventEndDate ||
            !startTime ||
            !endTime
        ) {
            Alert.alert("Please fill in all fields");
            return;
        }
        try {
            const dbRef = ref(getDatabase());
            const eventId = event.event_id;
            const eventRef = child(dbRef, `events/${eventId}`);

            const eventSnapshot = await get(eventRef);
            if (!eventSnapshot.exists()) {
                throw new Error(`Event with ID ${eventId} does not exist`);
            }

            const updatedEvent = {
                name: weddingName,
                description: description,
                mainLocation: location,
                startDate: eventStartDate,
                endDate: eventEndDate,
                startTime: startTime,
                endTime: endTime,
            };

            await update(eventRef, updatedEvent);

            navigation.navigate("SingleEvent", { event: updatedEvent });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Wedding details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wedding name"
                        value={weddingName}
                        onChangeText={setWeddingName}
                        required={true}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        required={true}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Main location"
                        value={location}
                        onChangeText={setLocation}
                        required={true}
                    />
                    <TouchableOpacity style={styles.outlineButton}>
                        <TouchableOpacity onPress={() => setOpen(true)}>
                            <Text style={styles.outlineButtonText}>
                                {eventStartDate && eventEndDate
                                    ? `${new Date(
                                          eventStartDate
                                      ).toLocaleString("en-US", {
                                          weekday: "long",
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                      })} - ${new Date(
                                          eventEndDate
                                      ).toLocaleString("en-US", {
                                          weekday: "long",
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                      })}`
                                    : "Select Date(s)"}
                            </Text>
                        </TouchableOpacity>
                        <SafeAreaProvider>
                            <DatePickerModal
                                mode="range"
                                locale="en"
                                visible={open}
                                onDismiss={onDismissRange}
                                startDate={eventStartDate}
                                endDate={eventEndDate}
                                onConfirm={onConfirmRange}
                                saveLabel="Save"
                                label="Select Date Range"
                                startLabel="From"
                                endLabel="To"
                                animationType="slide"
                            />
                        </SafeAreaProvider>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.outlineButton}
                        onPress={() => {
                            setVisible(true);
                            setSelectedEventType("start");
                        }}
                    >
                        <Text style={styles.outlineButtonText}>
                            {startTime ? startTime : "Select Start Time"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.outlineButton}
                        onPress={() => {
                            setVisible(true);
                            setSelectedEventType("end");
                        }}
                    >
                        <Text style={styles.outlineButtonText}>
                            {endTime ? endTime : "Select End Time"}
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
                        />
                    </SafeAreaProvider>
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        required={true}
                    >
                        <Text style={styles.submitButtonText}>
                            Update Event
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                        navigation.navigate("Create Guest List", {
                            event: event,
                        })
                    }
                >
                    <Text style={styles.addButtonText}>Edit Guests</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                        navigation.navigate("All Notifications", {
                            event: event,
                        })
                    }
                >
                    <Text style={styles.addButtonText}>View Notifications</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                        navigation.navigate("Maps", {
                            eventId: event.event_id || "0",
                            eventHost: event.host_id,
                        })
                    }
                >
                    <Text style={styles.addButtonText}>View Locations</Text>
                </TouchableOpacity>
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

export default EditEvent;
