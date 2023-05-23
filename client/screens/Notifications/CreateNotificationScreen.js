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
import { getDatabase, ref, child, push, set, update } from "firebase/database";
import { DatePickerModal } from "react-native-paper-dates";
// import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
import BlueBG from "../../../assets/BlueBG.png";

const screenWidth = Dimensions.get("window").width;

const CreateNotification = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const eventId = event.event_id;
    const eventName = event.name;
    const [notification, setNotification] = useState([]);
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const navigation = useNavigation();

    const onDismiss = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleDeleteNotification = () => {
        setNotification({});
        navigation.navigate("All Reminders", { event: event });
    };

    const handleUpdateNotification = (field, value) => {
        setNotification((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (
            !notification.title ||
            !notification.body ||
            !notification.scheduled_date
        ) {
            Alert.alert("Please fill in all fields");
            return;
        }

        const dbRef = ref(getDatabase());
        const notificationRef = child(dbRef, "notifications");
        const eventNotificationRef = child(
            dbRef,
            `events/${eventId}/notifications`
        );

        const newNotificationRef = push(notificationRef);
        const newNotificationKey = newNotificationRef.key;

        const {
            title: notificationTitle,
            body: notificationBody,
            scheduled_date: notificationDate,
            // scheduled_time: notificationTime,
        } = notification;
        const newNotificationData = {
            title: notificationTitle,
            body: notificationBody,
            scheduled_date: notificationDate,
            // scheduled_time: notificationTime,
            event_id: eventId,
            event_name: eventName,
            recipients: { allGuests: true },
            notification_id: newNotificationKey,
        };
        await set(newNotificationRef, newNotificationData);

        const newEventNotificationRef = child(
            eventNotificationRef,
            newNotificationKey
        );
        await update(newEventNotificationRef, {
            notification_id: newNotificationKey,
        });

        navigation.goBack();
    };

    return (
        <ImageBackground
            source={BlueBG}
            resizeMode="cover"
            style={{
                flex: 1,
                width: "100%",
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
                                padding: 5,
                                textAlign: "center",
                            }}
                        >
                            Reminders
                        </Text>
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                                marginLeft: 8,
                                fontWeight: "bold",
                            }}
                        >
                            Reminder type:
                        </Text>
                        <TextInput
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
                            placeholder="RSVP deadline, Reminder to book flights, etc."
                            value={notification.type}
                            onChangeText={(value) =>
                                handleUpdateNotification("title", value)
                            }
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
                            Reminder text:
                        </Text>
                        <TextInput
                            style={{
                                ...globalStyles.input,
                                backgroundColor: "white",
                            }}
                            placeholder="Enter reminder text here..."
                            value={notification.type}
                            onChangeText={(value) =>
                                handleUpdateNotification("body", value)
                            }
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
                                    backgroundColor: "#38b6ff",
                                    height: 100,
                                    width: screenWidth / 1.5,
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
                                        {notification.scheduled_date
                                            ? new Date(
                                                  notification.scheduled_date
                                              ).toLocaleDateString("en-US", {
                                                  weekday: "short",
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              })
                                            : "Select date"}
                                    </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <SafeAreaProvider>
                                <DatePickerModal
                                    locale="en"
                                    mode="single"
                                    visible={open}
                                    onDismiss={onDismissSingle}
                                    date={notification.scheduled_date}
                                    onConfirm={(selectedDate) => {
                                        handleUpdateNotification(
                                            "scheduled_date",
                                            selectedDate.date.toISOString()
                                        );
                                        setOpen(false);
                                    }}
                                    saveLabel="Save"
                                    required={true}
                                />
                            </SafeAreaProvider>
                            <TouchableOpacity
                                style={{
                                    ...globalStyles.button,
                                    width: 150,
                                    backgroundColor: "red",
                                }}
                                onPress={() => handleDeleteNotification()}
                            >
                                <Ionicons
                                    name="close-circle-outline"
                                    size={25}
                                    color="white"
                                    marginBottom={12}
                                />
                                <Text
                                    style={{
                                        ...globalStyles.paragraph,
                                        fontWeight: "bold",
                                        color: "white",
                                    }}
                                >
                                    Clear Form
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{
                                ...globalStyles.button,
                                backgroundColor: "green",
                            }}
                            onPress={handleSubmit}
                        >
                            <Ionicons
                                name="send-outline"
                                size={25}
                                color="white"
                                marginBottom={12}
                            />
                            <Text style={styles.submitButtonText}>
                                Create Reminder
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
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

export default CreateNotification;

//  {/* <TouchableOpacity
//                                 style={styles.outlineButton}
//                                 onPress={() => setVisible(true)}
//                             >
//                                 <Text style={styles.outlineButtonText}>
//                                     {notification.scheduled_time
//                                         ? `${notification.scheduled_time}`
//                                         : "Select time (optional)"}
//                                 </Text>
//                             </TouchableOpacity>
//                             <SafeAreaProvider>
//                                 <TimePickerModal
//                                     visible={visible}
//                                     mode="time"
//                                     time={notification.scheduled_time}
//                                     onConfirm={(selectedTime) => {
//                                         const date = new Date();
//                                         date.setHours(selectedTime.hours);
//                                         date.setMinutes(selectedTime.minutes);
//                                         const formattedTime =
//                                             date.toLocaleTimeString([], {
//                                                 hour: "2-digit",
//                                                 minute: "2-digit",
//                                             });
//                                         handleUpdateNotification(
//                                             "scheduled_time",
//                                             formattedTime
//                                         );
//                                         setVisible(false);
//                                     }}
//                                     onDismiss={onDismiss}
//                                     hours={12}
//                                     minutes={30}
//                                     required={false}
//                                 />
//                             </SafeAreaProvider> */}
