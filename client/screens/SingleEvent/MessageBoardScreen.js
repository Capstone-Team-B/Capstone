import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    query,
    orderByChild,
    equalTo,
} from "firebase/database";
import { auth } from "../../../firebase";

const MessageboardScreen = (params) => {
    console.log("params", params.route.params);
    // LOG  params {"eventId": undefined, "name": "kit's wedding"}
    // const [eventId, setEventId] = useState(params.route.params.eventId);
    const [eventId, setEventId] = useState("temp");

    console.log("eventID", eventId);
    const dbRef = ref(getDatabase());
    const db = getDatabase();
    const [newMessage, setNewMessage] = useState("");
    const [eventName, setEventName] = useState(params.route.params.name || "");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        get(
            query(
                child(dbRef, "messageboard"),
                orderByChild("event_id"),
                equalTo(eventId)
            )
        )
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const messageList = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    setMessages(messageList);
                    setEventName(params.route.params.name);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [eventId]);
    const handleSubmitMessage = () => {
        // this makes the unique ID for the message
        let message_id = Date.now();
        const currentTime = new Date().toISOString();
        if (newMessage !== "") {
            set(ref(db, `messages/${uid}`), {
                content: newMessage,
                dateTimeStamp: currentTime,
                event_id: eventId,
                sender_id: auth.currentUser.uid,
                SenderName:
                    `${auth.currentUser.firstName} ${auth.currentUser.lastName}` ||
                    "Unknown",
                message_id: message_id,
            })
                .then(() => {
                    setNewMessage("");
                })
                .catch((error) => {
                    console.error(error);
                });
            get(
                query(
                    child(dbRef, "messageboard"),
                    orderByChild("event_id"),
                    equalTo(eventId)
                )
            )
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const messageList = Object.keys(data).map((key) => ({
                            id: key,
                            ...data[key],
                        }));
                        setMessages(messageList);
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else console.log("blank Message");
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.eventLabel}>Messages for {eventName}</Text>
            <View style={styles.inputContainer}>
                {messages.map((message) => (
                    <View key={message.id} style={styles.item}>
                        <Text style={styles.firstName}>{message.message}</Text>
                        <Text style={styles.nameText}>{message.user_name}</Text>
                    </View>
                ))}
                <TextInput
                    placeholder="Write here"
                    style={styles.input}
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <TouchableOpacity
                    onPress={handleSubmitMessage}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Add Your Message</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default MessageboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#0782F9",
        width: "60%",
        padding: 5,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    inputContainer: {
        width: "80%",
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    // nameText: {
    //     color: "blue",
    //     fontWeight: "400",
    //     fontSize: "12",
    // },
    // eventLabel: {
    //     color: "purple",
    //     fontWeight: "700",
    //     fontSize: "24",
    // },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
