import React, { useEffect, useState, useRef } from "react";
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
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as storage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function NotificationsScreen() {
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const { uid } = props.route.params;
    const [notifications, setNotifications] = useState([]);
    const navigation = useNavigation();
    const dbRef = ref(getDatabase());
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const getEvents = async (eventIdArray) => {
        let events = [];
        for (let i = 0; i < eventIdArray.length; i++) {
            try {
                const eventsQuery = query(
                    child(dbRef, `events/${eventIdArray[i]}`)
                );
                await get(eventsQuery).then((eventSnapshot) => {
                    if (eventSnapshot.exists()) {
                        const data = eventSnapshot.val();
                        events = [...events, data];
                    } else {
                        console.log("no event data");
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        setEventList(events);
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
                    getEvents(userEventIds);
                } else {
                    console.log("no event data");
                }
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }, [isFocused]);

    useEffect(() => {
        const getPermission = async () => {
            if (Device.isDevice) {
                const { status: existingStatus } =
                    await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== "granted") {
                    const { status } =
                        await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== "granted") {
                    alert("Enable push notifications to use the app!");
                    await storage.setItem("expopushtoken", "");
                    return;
                }
                const token = (await Notifications.getExpoPushTokenAsync())
                    .data;
                await storage.setItem("expopushtoken", token);
            } else {
                alert("Must use physical device for Push Notifications");
            }

            if (Platform.OS === "android") {
                Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }
        };

        getPermission();

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {}
            );

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            );
            Notifications.removeNotificationSubscription(
                responseListener.current
            );
        };
    }, []);

    const onClick = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Title",
                body: "body",
                data: { data: "data goes here" },
            },
            trigger: {
                seconds: 1,
            },
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <View key={notification} style={styles.item}>
                                <Text style={styles.input}>
                                    Title: {notification.title}
                                </Text>
                                <Text style={styles.input}>
                                    Body: {notification.body}
                                </Text>
                                <Text style={styles.input}>
                                    Sent Date: {notification.scheduled_date}
                                </Text>
                                <Text style={styles.input}>
                                    Sent Time:{" "}
                                    {new Date(
                                        notification.scheduled_time
                                    ).toLocaleTimeString()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text>No notifications found</Text>
                    )}
                    <View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() =>
                                navigation.navigate("Create Notification", {
                                    event: event,
                                })
                            }
                        >
                            <Text style={styles.addButtonText}>
                                Create New Notification
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
