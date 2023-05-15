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
import { getDatabase, ref, child, push, set, update } from "firebase/database";
import { DatePickerModal } from "react-native-paper-dates";
import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
        navigation.navigate("All Notifications", { event: event });
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
            !notification.scheduled_date ||
            !notification.scheduled_time
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
            scheduled_time: notificationTime,
        } = notification;
        const newNotificationData = {
            title: notificationTitle,
            body: notificationBody,
            scheduled_date: notificationDate,
            scheduled_time: notificationTime,
            event_id: eventId,
            event_name: eventName,
            notification_id: newNotificationKey,
        };
        await set(newNotificationRef, newNotificationData);

        const newEventNotificationRef = child(
            eventNotificationRef,
            newNotificationKey
        );
        await update(newEventNotificationRef, {
            [newNotificationKey]: newNotificationKey,
        });

        navigation.navigate("All Notifications", { event: event });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <View style={styles.section}>
                        <View style={styles.section}>
                            <TextInput
                                style={styles.input}
                                placeholder="RSVP deadline, Reminder to book flights, etc."
                                value={notification.type}
                                onChangeText={(value) =>
                                    handleUpdateNotification("title", value)
                                }
                                required={true}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter notification text here..."
                                value={notification.type}
                                onChangeText={(value) =>
                                    handleUpdateNotification("body", value)
                                }
                                required={true}
                            />
                            <TouchableOpacity
                                style={styles.outlineButton}
                                onPress={() => setOpen(true)}
                            >
                                <TouchableOpacity onPress={() => setOpen(true)}>
                                    <Text style={styles.outlineButtonText}>
                                        {notification.scheduled_date
                                            ? new Date(
                                                  notification.scheduled_date
                                              ).toLocaleDateString("en-US", {
                                                  weekday: "short",
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              })
                                            : "Select Notification Date"}
                                    </Text>
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
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.outlineButton}
                                onPress={() => setVisible(true)}
                            >
                                <Text style={styles.outlineButtonText}>
                                    {notification.scheduled_time
                                        ? `${notification.scheduled_time}`
                                        : "Select Notification Time"}
                                </Text>
                            </TouchableOpacity>
                            <SafeAreaProvider>
                                <TimePickerModal
                                    visible={visible}
                                    mode="time"
                                    time={notification.scheduled_time}
                                    onConfirm={(selectedTime) => {
                                        const date = new Date();
                                        date.setHours(selectedTime.hours);
                                        date.setMinutes(selectedTime.minutes);
                                        const formattedTime = date.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        });
                                        handleUpdateNotification(
                                            "scheduled_time",
                                            formattedTime
                                        );
                                        setVisible(false);
                                    }}
                                    onDismiss={onDismiss}
                                    hours={12}
                                    minutes={30}
                                    required={true}
                                />
                            </SafeAreaProvider>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteNotification()}
                            >
                                <Text style={styles.deleteButtonText}>
                                    Clear Form
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
                            Create Notifications
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

export default CreateNotification;
