//Nataly was here
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getDatabase, ref, child, get } from "firebase/database";

const SingleEvent = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    // console.log(event);

    useEffect(() => {
        setEvent(params.route.params.event);
    }, [params.route.params.event]);

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text> {event.name}</Text>
            <Text> {event.description}</Text>
            <Text>
                {" "}
                {new Date(event.date).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </Text>
            <Text> {event.location}</Text>
            <Text>
                {" "}
                {event.startTime} & {event.endTime}
            </Text>
            <Text> {event.description}</Text>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("GuestScreen", { event: event })
                }
            >
                <Text>View All Guests</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("MessageboardScreen", {
                        eventId: event.id,
                        name: event.name,
                    })
                }
            >
                <Text>Event MessageBoard</Text>
            </TouchableOpacity>
            <TouchableOpacity
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
                onPress={() =>
                    navigation.navigate("Edit Event", { event: event })
                }
            >
                <Text>Edit Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Guest", { eventId: event.id })
                }
            >
                <Text>Guest List</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Maps", { eventId: event.id })
                }
            >
                <Text>Maps and Events</Text>
            </TouchableOpacity>
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
});
