// REACT IMPORTS
import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
// FIREBASE IMPORTS
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
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";

const MessageboardScreen = (params) => {
    // COMPONENT VARIABLES
    const dbRef = ref(getDatabase());
    const db = getDatabase();

    // PROPS & PARAMS
    const uid = params.route.params.uid;

    // STATE
    const [event_id, setEvent_id] = useState(
        params.route.params.event_id || ""
    );
    const [userName, setUserName] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [eventName, setEventName] = useState(params.route.params.name || "");
    const [user_id, setUser_id] = useState(params.route.params.uid || "");
    const [messages, setMessages] = useState([]);

    // USEEFFECTS
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

    // FUNCTIONS
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
        <KeyboardAvoidingView
            style={{ ...globalStyles.container, padding: 0 }}
            behavior="height"
        >
            <View
                style={{
                    padding: 20,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ ...globalStyles.heading2, textAlign: "center" }}>
                    Messages for
                </Text>
                <Text
                    style={{
                        ...globalStyles.heading1,
                        fontFamily: "Bukhari Script",
                        textAlign: "center",
                        padding: 5,
                    }}
                >
                    {eventName}
                </Text>
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                {messages.length === 0 ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItem: "center",
                            flex: 1,
                        }}
                    >
                        <Text style={{ textAlign: "center" }}>
                            be the first to leave a message!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={messages}
                        keyExtractor={(message) => message.id}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    margin: 10,
                                    padding: 10,
                                    borderRadius: 10,
                                    borderColor:
                                        uid === item.sender_id
                                            ? "#38b6ff"
                                            : "#cb6cd6",
                                    borderWidth: 2,
                                    justifyContent:
                                        uid === item.sender_id
                                            ? "flex-end"
                                            : "flex-start",
                                    alignItems:
                                        uid === item.sender_id
                                            ? "flex-end"
                                            : "flex-start",
                                }}
                            >
                                <Text
                                    style={{
                                        ...globalStyles.heading3,
                                        textAlign:
                                            uid === item.sender_id
                                                ? "right"
                                                : "left",
                                    }}
                                >
                                    {item.content}
                                </Text>
                                <Text
                                    style={{
                                        ...globalStyles.paragraph,
                                        fontStyle: "italic",
                                        marginTop: 5,
                                        textAlign:
                                            uid === item.sender_id
                                                ? "right"
                                                : "left",
                                    }}
                                >
                                    posted by {item.senderName}
                                    {"\n"}
                                    {new Date(
                                        item.dateTimeStamp
                                    ).toLocaleString("en", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                    })}
                                </Text>
                            </View>
                        )}
                    />
                )}
            </SafeAreaView>
            <SafeAreaView style={styles.messageInputContainer}>
                <TextInput
                    placeholder="Write here"
                    style={styles.messageInput}
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <TouchableOpacity onPress={handleSubmitMessage}>
                    <View style={styles.sendBtn}>
                        <Ionicons name="send-outline" size={25} color="white" />
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default MessageboardScreen;

const styles = StyleSheet.create({
    sendBtn: {
        backgroundColor: "#38b6ff",
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        margin: 15,
        borderWidth: 2,
        borderColor: "white",
    },
    messageInput: {
        ...globalStyles.input,
        backgroundColor: "white",
        margin: 15,
        flex: 1,
    },
    messageInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 100,
        backgroundColor: "#38b6ff",
    },
});
