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
import { useIsFocused } from "@react-navigation/native";

const NotificationsScreen = (props) => {
    const { uid } = props.route.params;
    const [eventNotificationIds, setEventNotificationIds] = useState([]);
    const [notificationData, setNotificationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const dbRef = ref(getDatabase());
    const isFocused = useIsFocused();

    const getEventNotifications = async (eventIdArray) => {
        let eventNotifications = [];
        for (let i = 0; i < eventIdArray.length; i++) {
            let eventId = eventIdArray[i].event_id;
            try {
                const eventsQuery = query(
                    child(dbRef, `events/${eventId}/notifications`)
                );
                await get(eventsQuery).then((eventSnapshot) => {
                    if (eventSnapshot.exists()) {
                        const data = eventSnapshot.val();
                        const eventObjs = Object.values(data);
                        for (let j=0; j<eventObjs.length; j++){
                            let eventId = eventObjs[j].notification_id
                            eventNotifications.push(eventId);
                        }
                    } else {
                        console.log("no event data");
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        setEventNotificationIds(eventNotifications);
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
                        notificationData.push(data);
                    } else {
                        console.log("no reminder data");
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        setNotificationData(notificationData);
    };

    useEffect(() => {
        setLoading(true);
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
                    setLoading(false);
                } else {
                    console.log("no reminder data");
                }
            });
        } catch (error) {
            console.log(error);
        }

    }, [isFocused]);

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
          <ScrollView style={styles.container}>
            <View style={styles.section}>
              {loading ? (
                <Text>...Loading your reminders</Text>
              ) : notificationData.length > 0 ? (
                notificationData.map((notification) => {
                  console.log("notification--->", notification);
                  const scheduledDate = new Date(notification.scheduled_date);
                  const currentDate = new Date();
                  const isPastDate = scheduledDate < currentDate;
                  console.log("isPastDate --->", !isPastDate);
                  return !isPastDate ? (
                    <View key={notification.notification_id} style={styles.item}>
                      <Text style={styles.input}>{notification.event_name}</Text>
                      <Text style={styles.input}>{notification.title}:</Text>
                      <Text style={styles.input}>{notification.body}</Text>
                      <View>
                        <Text style={styles.input}>
                          {" "}
                          {scheduledDate.toLocaleString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
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
