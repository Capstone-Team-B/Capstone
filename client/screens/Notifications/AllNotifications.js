import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, child, get, query } from "firebase/database";
import { useIsFocused } from "@react-navigation/native";

const AllNotifications = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const eventId = event.event_id;
    const [notifications, setNotifications] = useState([]);
    const navigation = useNavigation();
    const dbRef = ref(getDatabase());
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const getNotifications = async () => {
            setLoading(true);
            const eventQuery = query(child(dbRef, `events/${eventId}`));
            try {
                const snapshot = await get(eventQuery);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setEvent(data);

                    let notificationData = [];
                    const notificationIds = Object.keys(data.notifications);

                    for (let i = 0; i < notificationIds.length; i++) {
                        const notificationQuery = query(
                            child(dbRef, `notifications/${notificationIds[i]}`)
                        );
                        try {
                            const notificationSnapshot = await get(
                                notificationQuery
                            );
                            if (notificationSnapshot.exists()) {
                                const notificationDataItem =
                                    notificationSnapshot.val();
                                notificationData.push(notificationDataItem);
                            } else {
                                console.log("No data available");
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    setNotifications(notificationData);
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        getNotifications();
    }, [isFocused]);

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    {loading ? (
                        <Text>...Loading your reminders</Text>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <View
                                key={notification.notification_id}
                                style={styles.item}
                            >
                                <Text style={styles.input}>
                                    Title: {notification.title}
                                </Text>
                                <Text style={styles.input}>
                                    Body: {notification.body}
                                </Text>
                                <Text style={styles.input}>
                                    Scheduled Date:{" "}
                                    {new Date(
                                        notification.scheduled_date
                                    ).toLocaleString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </Text>
                                {/* <Text style={styles.input}>
                                    Scheduled Time:{" "}
                                    {notification.scheduled_time}
                                </Text> */}
                                <TouchableOpacity
                                    style={styles.outlineButton}
                                    onPress={() =>
                                        navigation.navigate("Edit Reminder", {
                                            notification: notification,
                                            event: event,
                                        })
                                    }
                                >
                                    <Text style={styles.outlineButtonText}>
                                        Edit Reminder
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text>No reminders found</Text>
                    )}
                    <View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() =>
                                navigation.navigate("Create Reminder", {
                                    event: event,
                                })
                            }
                        >
                            <Text style={styles.addButtonText}>
                                Create New Reminder
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

export default AllNotifications;
