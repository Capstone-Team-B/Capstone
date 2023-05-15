//Nataly was here
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getDatabase, ref, child, get } from "firebase/database";
import Feather from "react-native-vector-icons/Feather";
import globalStyles from "../../utils/globalStyles";

const SingleEvent = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const uid = params.route.params.uid;
    console.log("users unique id --> ", params.route.params.uid);

    useEffect(() => {
        setEvent(params.route.params.event);
    }, [params.route.params.event]);

    const navigation = useNavigation();
    // console.log("event.id -->", event)
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.heading1}> {event.name}</Text>
            <Text style={globalStyles.heading2}> {event.description}</Text>
            <Text style={globalStyles.heading2}>
                {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}{" "}
                -{" "}
                {new Date(event.endDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </Text>
            <Text style={globalStyles.heading2}> {event.location}</Text>
            <Text style={globalStyles.paragraph}>
                {" "}
                {event.startTime} & {event.endTime}
            </Text>
            <Text style={globalStyles.paragraph}> {event.description}</Text>
            {uid === event.host_id ? (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Edit Event", { event: event })
                    }
                >
                    <Text styles={globalStyles.heading2}>Edit Your Event</Text>
                    <Feather name="edit" size={25} />
                </TouchableOpacity>
            ) : null}
            <View style={styles.tileContainer}>
                <TouchableOpacity
                    style={styles.tile}
                    onPress={() =>
                        navigation.navigate("GuestProfileScreen", {
                            eventId: event.id,
                        })
                    }
                >
                    <Text>My Guest Profile</Text>
                </TouchableOpacity>
                {/* need to add logic to only show if user is host */}

                <TouchableOpacity
                    style={styles.tile}
                    onPress={() =>
                        navigation.navigate("GuestListScreen", { event: event })
                    }
                >
                    <Text>Guest List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tile}
                    onPress={() =>
                        navigation.navigate("Maps", { eventId: event.id })
                    }
                >
                    <Text>Maps and Events</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tile}
                    onPress={() =>
                        navigation.navigate("EventGallery", {
                            event: event,
                            uid: uid,
                        })
                    }
                >
                    <Text>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tile}
                    onPress={() =>
                        navigation.navigate("MessageboardScreen", {
                            event_id: event.event_id,
                            eventMessages: event.messages,
                            name: event.name,
                            user_id: params.route.params.uid,
                        })
                    }
                >
                    <Text>Message Board</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SingleEvent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#0782F9",
        width: "60%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 40,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    tileContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tile: {
        height: 150,
        width: 150,
        padding: 10,
        margin: 10,
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 10,
    },
});
