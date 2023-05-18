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
import globalStyles from "../../utils/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";

const CreateEventForm = (props) => {
    const [weddingName, setWeddingName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedEventType, setSelectedEventType] = useState("");
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const { uid } = props.route.params;

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
        },
        [setOpen, setEventStartDate, setEventEndDate]
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
            !location ||
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
            const currentUser = auth.currentUser;
            if (!currentUser) {
                navigation.navigate("Login");
                return;
            }
            const currentUserId = currentUser.uid;
            const eventRef = child(dbRef, "events");
            const newEventRef = push(eventRef);
            const newEventId = newEventRef.key;
            const newEvent = {
                event_id: newEventId,
                name: weddingName,
                description: description,
                mainLocation: location,
                startDate: eventStartDate,
                endDate: eventEndDate,
                startTime: startTime,
                endTime: endTime,
                host_id: currentUserId,
            };
            await set(newEventRef, newEvent);

            const userRef = child(dbRef, `users/${uid}/userEvents`);
            const updatedUser = push(userRef);
            const newUserEvent = newEventId;
            await set(updatedUser, newUserEvent);

            navigation.navigate("SingleEvent", { event: newEvent });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={globalStyles.container} behavior="height">
            <ScrollView>
                <View>
                    <Text
                        style={{
                            ...globalStyles.heading1,
                            fontFamily: "Bukhari Script",
                            margin: 20,
                            textAlign: "center",
                        }}
                    >
                        New Event Details
                    </Text>
                    <Text
                        style={{
                            ...globalStyles.paragraph,
                            marginBottom: 12,
                            marginLeft: 8,
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
                    <View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",}}>
                        <TouchableOpacity
                            style={{
                                ...globalStyles.button, flex: 1, margin: 0, backgroundColor: "#38B6FF", marginRight: 6, width: 150, 
                            }}
                            onPress={() => setOpen(true)}
                        >
                            <TouchableOpacity onPress={() => setOpen(true)}>
                                <TouchableOpacity
                                    onPress={() => setOpen(true)}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
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
                                              })}${`\n`}-${`\n`}${new Date(
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
                                    onConfirm={onConfirmRange} // !@# fix error when you click save without selecting dates
                                    saveLabel="Save"
                                    label="Select Date Range"
                                    startLabel="From"
                                    endLabel="To"
                                    animationType="slide"
                                />
                            </SafeAreaProvider>
                        </TouchableOpacity>
                        <View
                            style={{ flex: 1,
                                justifyContent: "center", alignItems: "center", width: 150, marginLeft: 6, 
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    ...globalStyles.button, width: "100%",
                                    backgroundColor: "#699DF7",
                                    margin: 0
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
                                    }}
                                >
                                    {startTime
                                        ? startTime
                                        : "Select Start Time"}
                                </Text>
                            </TouchableOpacity>
                            <Ionicons
                                name="time-outline"
                                size={25}
                                margin={12}
                            />
                            <TouchableOpacity
                                style={{
                                    ...globalStyles.button, width: "100%",
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
                                    }}
                                >
                                    {endTime ? endTime : "Select End Time"}
                                </Text>
                            </TouchableOpacity>
                        </View>

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
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    {weddingName &&
                    location &&
                    eventStartDate &&
                    eventEndDate &&
                    startTime &&
                    endTime ? (
                        <TouchableOpacity
                            style={{
                                ...globalStyles.button,
                                height: 150,
                                width: 150,
                                backgroundColor: "#cb6ce6",
                                borderRadius: 200,
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 30,
                            }}
                            onPress={handleSubmit}
                            required={true}
                        >
                            <Ionicons
                                name="rocket-outline"
                                size={55}
                                color="white"
                            />
                            <Text
                                style={{
                                    ...globalStyles.heading2,
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Create Event
                            </Text>
                        </TouchableOpacity>
                    ) : null}
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
