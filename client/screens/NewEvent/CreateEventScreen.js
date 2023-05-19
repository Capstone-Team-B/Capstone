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
    Dimensions,
    ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DatePickerModal } from "react-native-paper-dates";
import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
// FIREBASE IMPORTS
import { auth } from "../../../firebase";
import { getDatabase, ref, child, set, push } from "firebase/database";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
import BlueBG from "../../../assets/BlueBG.png";

const screenWidth = Dimensions.get("window").width;

const CreateEventForm = (props) => {
    // COMPONENT VARIABLES
    const navigation = useNavigation();

    // PROPS & PARAMS
    const { uid } = props.route.params;

    // STATE
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
    const [coverPhoto, setCoverPhoto] = useState("");

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
        },
        [setOpen, setEventStartDate, setEventEndDate]
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
                description: description,
                endDate: eventEndDate,
                endTime: endTime,
                event_id: newEventId,
                host_id: currentUserId,
                guestList: {
                    [uid]: {
                        guest_id: uid,
                        attending: true,
                    },
                },
                mainLocation: location,
                name: weddingName,
                startDate: eventStartDate,
                startTime: startTime,
            };
            await set(newEventRef, newEvent);

            const userRef = child(dbRef, `users/${uid}/userEvents`);
            const updatedUser = push(userRef);
            const newUserEvent = {
                event_id: newEventId,
                attending: true,
            };
            await set(updatedUser, newUserEvent);

            navigation.navigate("SingleEvent", { uid: uid, event: newEvent });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        // <View
        //     style={{...globalStyles.container,
        //         alignItems: "center", justifyContent: "center"
        //     }}
        // >
        <ImageBackground
            source={BlueBG}
            resizeMode="cover"
            style={{
                flex: 1,
                width: "100%",
                // alignItems: "center",
                // justifyContent: "center",
            }}
        >
            <ScrollView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
                    <View style={{ margin: 12 }}>
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
                                fontWeight: "bold",
                            }}
                        >
                            Event name:
                        </Text>
                        <TextInput
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
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
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
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
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
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
                                    width: screenWidth / 1.5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() => setOpen(true)}
                            >
                                <TouchableOpacity
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    onPress={() => setOpen(true)}
                                >
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
                                                  })} - ${"\n"}${new Date(
                                                      eventEndDate
                                                  ).toLocaleString("en-US", {
                                                      weekday: "long",
                                                      month: "long",
                                                      day: "numeric",
                                                      year: "numeric",
                                                  })}`
                                                : "Select Dates"}
                                        </Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                <SafeAreaProvider>
                                    <DatePickerModal // !@# after selecting/saving dates, if you click again to change the dates you get an error
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
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    ...globalStyles.button,
                                    backgroundColor: "#699DF7",
                                    margin: 0,
                                    height: 80,
                                    width: 160,
                                    alignItems: "center",
                                    justifyContent: "center",
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
                                    ...globalStyles.button,
                                    backgroundColor: "#9A85EE",
                                    margin: 0,
                                    height: 80,
                                    width: 160,
                                    alignItems: "center",
                                    justifyContent: "center",
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
                                    margin: 0,
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
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
        // {/* </View> */}
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
