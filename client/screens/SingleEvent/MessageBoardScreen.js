//TO DO get userprofile name to pass down from single event?
//get messages to render on screen.

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
    orderByKey,
} from "firebase/database";

const MessageboardScreen = (params) => {
    // console.log("params", params.route.params);
    // LOG  params {"eventMessages": [0], "event_id": "0", "name": "kit's wedding", "user_id": "NLxGphpLhkM6F8Gln8xuHC4hVxB2"}
    const [event_id, setEvent_id] = useState(
        params.route.params.event_id || ""
    );
    const [userName, setUserName] = useState("");

    const dbRef = ref(getDatabase());
    const db = getDatabase();
    const [newMessage, setNewMessage] = useState("");
    const [eventName, setEventName] = useState(params.route.params.name || "");
    const [user_id, setUser_id] = useState(params.route.params.user_id || "");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // querys database for messages
        get(
            query(
                child(dbRef, "messages"),
                orderByChild("event_id"),
                equalTo(event_id)
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
    }, [event_id]);

    useEffect(() => {
        // querys database for user
        get(query(child(dbRef, "users"), orderByKey(), equalTo(user_id)))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const userInfo = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    setUserName(
                        ` ${userInfo[0].firstName} ${userInfo[0].lastName}`
                    );
                    // console.log("user name", userName);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [user_id]);

    const handleSubmitMessage = () => {
        // this makes the unique ID for the message
        let message_id = Date.now();
        const currentTime = new Date().toISOString();
        if (newMessage !== "") {
            set(ref(db, `messages/${message_id}`), {
                content: newMessage,
                dateTimeStamp: currentTime,
                event_id: event_id,
                sender_id: user_id,
                senderName: userName || "Unknown",
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
                    child(dbRef, "messages"),
                    orderByChild("event_id"),
                    equalTo(event_id)
                )
            )
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const messageList = Object.keys(data).map((key) => ({
                            id: key,
                            ...data[key],
                        }));
                        // console.log(
                        //     "messageList after submit -->",
                        //     messageList
                        // );
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
                        <Text style={styles.firstName}>{message.content}</Text>
                        <Text style={styles.nameText}>
                            {message.senderName}
                        </Text>
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
