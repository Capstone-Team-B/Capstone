import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    StyleSheet,
    Text,
} from "react-native";
import {
    getDatabase,
    ref,
    child,
    get,
    query,
    orderByChild,
} from "firebase/database";
import { auth } from "../../../firebase";
import { useIsFocused } from "@react-navigation/native";

const NotificationsScreen = () => {
    const uid = auth.currentUser.uid;
    const [eventNotificationIds, setEventNotificationIds] = useState([]);
    const [notificationData, setNotificationData] = useState([]);
    const dbRef = ref(getDatabase());
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const getEventNotifications = async (eventIdArray) => {
        let eventNotifications = [];
        for (let i = 0; i < eventIdArray.length; i++) {
            try {
                const eventsQuery = query(
                    child(dbRef, `events/${eventIdArray[i]}/notifications`)
                );
                await get(eventsQuery).then((eventSnapshot) => {
                    if (eventSnapshot.exists()) {
                        const data = eventSnapshot.val();
                        eventNotifications = [...eventNotifications, data];
                    } else {
                        console.log("no event data");
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        setEventNotificationIds(Object.keys(eventNotifications));
    };

    const getNotificationData = async (arr) => {
        let notificationData = [];
        for (let i = 0; i < arr.length; i++) {
            try {
                const notificationsQuery = query(
                    child(dbRef, `notifications/${arr[i]}`)
                );
                await get(notificationsQuery).then((notificationSnapshot) => {
                    if (notificationSnapshot.exists()) {
                        const data = notificationSnapshot.val();
                        notificationData = [...notificationData, data];
                    } else {
                        console.log("no notification data");
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        setNotificationData(notificationData);
        setLoading(false);
    };

    useEffect(() => {
        const eventIdsQuery = query(
            child(dbRef, `users/${uid}`),
            orderByChild("userEvents")
        );
        try {
            get(eventIdsQuery).then((eventSnapshot) => {
                if (eventSnapshot.exists()) {
                    const data = eventSnapshot.val();
                    const userEventIds = Object.values(data.userEvents);
                    getEventNotifications(userEventIds);
                    getNotificationData(eventNotificationIds);
                } else {
                    console.log("no notification data");
                }
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }, [isFocused]);

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    {notificationData ? (
                        notificationData.map((notification) => {
                            const scheduledDate = new Date(
                                notification.scheduled_date
                            );
                            const currentDate = new Date();
                            const isPastDate = scheduledDate < currentDate;

                            return (
                                <View key={notification} style={styles.item}>
                                    <Text style={styles.input}>
                                        {notification.title}:
                                    </Text>
                                    <Text style={styles.input}>
                                        {notification.body}
                                    </Text>
                                    <View>
                                        {isPastDate ? (
                                            <Text style={styles.input}>
                                                Sent Date:{" "}
                                                {scheduledDate.toLocaleString(
                                                    "en-US",
                                                    {
                                                        weekday: "long",
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </Text>
                                        ) : (
                                            <Text style={styles.input}>
                                                Scheduled Date:{" "}
                                                {scheduledDate.toLocaleString(
                                                    "en-US",
                                                    {
                                                        weekday: "long",
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <Text>No notifications found.</Text>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default NotificationsScreen;

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
