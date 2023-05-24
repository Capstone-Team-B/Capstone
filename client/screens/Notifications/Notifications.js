// REACT IMPORTS
import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, SafeAreaView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
// EXPO IMPORTS
import { Video } from "expo-av";
// FIREBASE IMPORTS
import {
    getDatabase,
    ref,
    child,
    get,
    query,
    orderByChild,
} from "firebase/database";
import { auth } from "../../../firebase";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";

const NotificationsScreen = () => {
    // COMPONENT VARIABLES
    const uid = auth.currentUser.uid;
    const dbRef = ref(getDatabase());
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    // STATE
    const [eventNotificationIds, setEventNotificationIds] = useState([]);
    const [notificationData, setNotificationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);

    // USEEFFECTS
    useEffect(() => {
        const loadNotifications = async () => {
            setLoading(true);
            const eventIdsQuery = query(
                child(dbRef, `users/${uid}`),
                orderByChild("userEvents")
            );
            try {
                const eventSnapshot = await get(eventIdsQuery);
                if (eventSnapshot.exists()) {
                    const data = eventSnapshot.val();
                    const userEventIds = Object.values(data.userEvents);
                    await getEventNotifications(userEventIds);
                } else {
                    console.log("no reminder data");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        loadNotifications();
    }, [isFocused]);

    // FUNCTIONS
    const getEventNotifications = async (eventIdArray) => {
        let eventNotifications = [];
        for (let i = 0; i < eventIdArray.length; i++) {
            let eventId = eventIdArray[i].event_id;
            try {
                const eventsQuery = query(
                    child(dbRef, `events/${eventId}/notifications`)
                );
                const eventSnapshot = await get(eventsQuery);
                if (eventSnapshot.exists()) {
                    const data = eventSnapshot.val();
                    const eventObjs = Object.values(data);
                    for (let j = 0; j < eventObjs.length; j++) {
                        let eventId = eventObjs[j].notification_id;
                        eventNotifications.push(eventId);
                    }
                } else {
                    console.log("no event data");
                }
            } catch (error) {
                console.log(error);
            }
        }
        setEventNotificationIds(eventNotifications);

        let notificationData = [];
        for (let i = 0; i < eventNotifications.length; i++) {
            try {
                const notificationsQuery = query(
                    child(dbRef, `notifications/${eventNotifications[i]}`)
                );
                const notificationSnapshot = await get(notificationsQuery);
                if (notificationSnapshot.exists()) {
                    const data = notificationSnapshot.val();
                    notificationData.push(data);
                } else {
                    console.log("no reminder data");
                }
            } catch (error) {
                console.log(error);
            }
        }
        setNotificationData(notificationData);
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView>
                <View>
                    {loading ? (
                        <Video
                            source={require("../../../assets/BeThereAnimation.mp4")}
                            style={styles.video}
                            shouldPlay
                            isLooping={false}
                            resizeMode="cover"
                            onPlaybackStatusUpdate={(status) => {
                                if (!status.isPlaying && status.didJustFinish) {
                                    handleVideoEnd();
                                }
                            }}
                        />
                    ) : notificationData.length > 0 ? (
                        notificationData.map((notification) => {
                            const scheduledDate = new Date(
                                notification.scheduled_date
                            );
                            const currentDate = new Date();
                            const isPastDate = scheduledDate < currentDate;
                            return !isPastDate ? (
                                <View
                                    key={notification.notification_id}
                                    style={styles.notificationView}
                                >
                                    <Text style={{ ...globalStyles.heading3 }}>
                                        {notification.event_name}
                                    </Text>
                                    <Text
                                        style={{
                                            ...globalStyles.paragraph,
                                        }}
                                    >
                                        {notification.title}:
                                    </Text>
                                    <Text
                                        style={{
                                            ...globalStyles.paragraph,
                                        }}
                                    >
                                        {notification.body}
                                    </Text>
                                    <View>
                                        <Text
                                            style={{
                                                ...globalStyles.paragraph,
                                            }}
                                        >
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
                                    </View>
                                </View>
                            ) : (
                                <View key={notification.notification_id}></View>
                            );
                        })
                    ) : (
                        <Text>No reminders found.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    notificationView: {
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 10,
        backgroundColor: "#8291F3",
        flex: 1,
        marginTop: 12,
        marginRight: 12,
        marginLeft: 12,
        padding: 20,
    },
});
