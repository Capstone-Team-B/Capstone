// REACT IMPORTS
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
import { DatePickerModal } from "react-native-paper-dates";
import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
// FIREBASE
import { getDatabase, ref, child, update, get } from "firebase/database";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";

const EditEvent = (params) => {
    // COMPONENT VARIABLES
    const navigation = useNavigation();

    // USESTATE
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

    // FUNCTIONS
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
        <KeyboardAvoidingView style={globalStyles.container} behavior="height">
            <ScrollView style={globalStyles.container}>
                <View style={styles.section}>
                    <Text
                        style={{
                            ...globalStyles.heading1,
                            fontFamily: "Bukhari Script",
                            margin: 20,
                            textAlign: "center",
                        }}
                    >
                        Edit Event Details
                    </Text>
                    <Text
                        style={{
                            ...globalStyles.paragraph,
                            marginBottom: 12,
                            marginLeft: 8,
                            fontWeight: "bold",
                        }}
                    >
                        Event name:
                    </Text>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="Event name"
                        value={weddingName}
                        onChangeText={setWeddingName}
                        required={true}
                    />
                    <Text
                        style={{
                            ...globalStyles.paragraph,
                            marginBottom: 12,
                            marginLeft: 8,
                            fontWeight: "bold",
                        }}
                    >
                        Description:
                    </Text>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        required={true}
                    />
                    <Text
                        style={{
                            ...globalStyles.paragraph,
                            marginBottom: 12,
                            marginLeft: 8,
                            fontWeight: "bold",
                        }}
                    >
                        Main location:
                    </Text>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="Main location"
                        value={location}
                        onChangeText={setLocation}
                        required={true}
                    />
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 12,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                ...globalStyles.button,
                                flex: 1,
                                margin: 0,
                                backgroundColor: "#38B6FF",
                                marginRight: 6,
                                width: 150,
                            }}
                        >
                            <TouchableOpacity onPress={() => setOpen(true)}>
                                <TouchableOpacity
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    onPress={() => setOpen(true)}
                                >
                                    <Ionicons
                                        name="calendar-outline"
                                        size={25}
                                        color="white"
                                        marginBottom={12}
                                    />
                                    <Text
                                        style={{
                                            ...globalStyles.paragraph,
                                            color: "white",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
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
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                ...globalStyles.button,
                                backgroundColor: "#699DF7",
                                margin: 0,
                            }}
                            onPress={() => {
                                setVisible(true);
                                setSelectedEventType("start");
                            }}
                        >
                            <Text
                                style={{
                                    ...globalStyles.paragraph,
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {startTime ? startTime : "Select Start Time"}
                            </Text>
                        </TouchableOpacity>
                        <Ionicons name="time-outline" size={25} margin={12} />
                        <TouchableOpacity
                            style={{
                                ...globalStyles.button,
                                backgroundColor: "#9A85EE",
                                margin: 0,
                            }}
                            onPress={() => {
                                setVisible(true);
                                setSelectedEventType("end");
                            }}
                        >
                            <Text
                                style={{
                                    ...globalStyles.paragraph,
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {endTime ? endTime : "Select End Time"}
                            </Text>
                        </TouchableOpacity>
                    </View>
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

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            ...globalStyles.button,
                            height: 150,
                            width: 150,
                            backgroundColor: "#cb6ce6",
                            borderRadius: 200,
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 0,
                        }}
                        onPress={handleSubmit}
                        required={true}
                    >
                        <Ionicons
                            name="checkbox-outline"
                            size={55}
                            color="white"
                        />
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
                        navigation.navigate("All Reminders", {
                            event: event,
                        })
                    }
                >
                    <Text style={styles.addButtonText}>View Reminders</Text>
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
