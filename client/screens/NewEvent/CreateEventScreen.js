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
import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, child, set, push } from "firebase/database";
import { DatePickerModal } from "react-native-paper-dates";
import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const CreateEventForm = () => {
    const [weddingName, setWeddingName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(undefined);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedEventType, setSelectedEventType] = useState("");
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const onDismiss = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onDismissSingle = useCallback(
        (params) => {
            setOpen(false);
            setDate(params.date);
        },
        [setOpen]
    );

    const onConfirmSingle = useCallback(
        (params) => {
            setOpen(false);
            setDate(params.date);
        },
        [setOpen, setDate]
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
        if (!weddingName || !location || !date || !startTime || !endTime) {
            Alert.alert("Please fill in all fields");
            return;
        }
        try {
            const dbRef = ref(getDatabase());
            const currentUser = auth.currentUser;
            if (!currentUser) {
                navigation.navigate("Login");
                return;
            }
            const currentUserId = currentUser.uid;
            const eventRef = child(dbRef, "events");
            const newEventRef = push(eventRef);
            const newEventId = newEventRef.key;
            console.log("id", newEventId);
            const newEvent = {
                id: newEventId,
                name: weddingName,
                description: description,
                location: location,
                date: date,
                startTime: startTime,
                endTime: endTime,
                host_id: currentUserId,
            };
            await set(newEventRef, newEvent);
            navigation.navigate("SingleEvent", { event: newEvent });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Wedding Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wedding Name"
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
                        placeholder="Location"
                        value={location}
                        onChangeText={setLocation}
                        required={true}
                    />
                    <TouchableOpacity
                        style={styles.outlineButton}
                        onPress={() => setOpen(true)}
                    >
                        <TouchableOpacity onPress={() => setOpen(true)}>
                            <TouchableOpacity onPress={() => setOpen(true)}>
                                <Text style={styles.outlineButtonText}>
                                    {date
                                        ? `${date.toLocaleDateString("en-US", {
                                              weekday: "short",
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                          })}`
                                        : "Select Date"}
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <SafeAreaProvider>
                            <DatePickerModal
                                mode="single"
                                locale="en"
                                visible={open}
                                onDismiss={onDismissSingle}
                                date={date}
                                onConfirm={onConfirmSingle}
                                saveLabel="Save"
                                label="Select date"
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
                            Create Event
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

export default CreateEventForm;
