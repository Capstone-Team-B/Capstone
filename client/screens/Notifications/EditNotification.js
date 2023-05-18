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
import { getDatabase, ref, child, remove, update } from "firebase/database";
import { DatePickerModal } from "react-native-paper-dates";
// import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const EditNotification = (params) => {
    const notification = params.route.params.notification;
    const event = params.route.params.event;
    const eventId = event.event_id;
    const notificationId = notification.notification_id;
    const [title, setTitle] = useState(notification.title || "");
    const [body, setBody] = useState(notification.body || "");
    const [date, setDate] = useState(
        new Date(notification.scheduled_date) || ""
    );
    // const [time, setTime] = useState(notification.scheduled_time || "");
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const navigation = useNavigation();

    const onDismiss = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleDeleteNotification = async () => {
        try {
            const dbRef = ref(getDatabase());
            const notificationRef = child(
                dbRef,
                `notifications/${notificationId}`
            );

            await remove(notificationRef);

            const eventRef = child(dbRef, `events/${eventId}/notifications`);
            const eventNotificationRef = child(eventRef, notificationId);
            await remove(eventNotificationRef);

            navigation.navigate("All Reminders", { event: event });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async () => {
        if (!title || !body || !date) {
            Alert.alert("Please fill in all fields");
            return;
        }
        try {
            const dbRef = ref(getDatabase());
            const notificationRef = child(
                dbRef,
                `notifications/${notificationId}`
            );

            const updatedNotification = {
                title: title,
                body: body,
                scheduled_date: date,
                // scheduled_time: time,
            };
            await update(notificationRef, updatedNotification);

            navigation.navigate("All Reminders", { event: event });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reminder</Text>
                    <View style={styles.section}>
                        <View style={styles.section}>
                            <TextInput
                                style={styles.input}
                                placeholder="RSVP deadline, Reminder to book flights, etc."
                                value={title}
                                onChangeText={(value) => {
                                    setTitle(value);
                                }}
                                required={true}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter reminder text here..."
                                value={body}
                                onChangeText={(value) => {
                                    setBody(value);
                                }}
                                required={true}
                            />
                            <TouchableOpacity
                                style={styles.outlineButton}
                                onPress={() => setOpen(true)}
                            >
                                <TouchableOpacity onPress={() => setOpen(true)}>
                                    <Text style={styles.outlineButtonText}>
                                        {date
                                            ? new Date(date).toLocaleDateString(
                                                  "en-US",
                                                  {
                                                      weekday: "short",
                                                      month: "short",
                                                      day: "numeric",
                                                      year: "numeric",
                                                  }
                                              )
                                            : "Select date"}
                                    </Text>
                                </TouchableOpacity>
                                <SafeAreaProvider>
                                    <DatePickerModal
                                        locale="en"
                                        mode="single"
                                        visible={open}
                                        onDismiss={onDismissSingle}
                                        date={date}
                                        onConfirm={(selectedDate) => {
                                            setDate(
                                                selectedDate.date.toISOString()
                                            );
                                            setOpen(false);
                                        }}
                                        saveLabel="Save"
                                        required={true}
                                    />
                                </SafeAreaProvider>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                style={styles.outlineButton}
                                onPress={() => setVisible(true)}
                            >
                                <Text style={styles.outlineButtonText}>
                                    {time
                                        ? `${time}`
                                        : "Select time (optional)"}
                                </Text>
                            </TouchableOpacity>
                            <SafeAreaProvider>
                                <TimePickerModal
                                    visible={visible}
                                    mode="time"
                                    time={time}
                                    onConfirm={(selectedTime) => {
                                        const date = new Date();
                                        date.setHours(selectedTime.hours);
                                        date.setMinutes(selectedTime.minutes);
                                        const formattedTime =
                                            date.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            });
                                        setTime(formattedTime);
                                        setVisible(false);
                                    }}
                                    onDismiss={onDismiss}
                                    hours={12}
                                    minutes={30}
                                    required={false}
                                />
                            </SafeAreaProvider> */}
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteNotification()}
                            >
                                <Text style={styles.deleteButtonText}>
                                    Delete Reminder
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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

export default EditNotification;
