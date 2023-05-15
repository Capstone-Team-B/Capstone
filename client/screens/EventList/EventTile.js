//Nataly was here
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import globalStyles from "../../utils/globalStyles";

const EventTile = ({ event, uid }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("SingleEvent", { event })}
        >
            <View
                key={event.id}
                style={
                    uid === event.host_id ? styles.itemHost : styles.itemGuest
                }
            >
                <Text style={globalStyles.heading2}>{event.name}</Text>
                <Text style={globalStyles.paragraph}>{new Date(event.date.startDate).toLocaleDateString(
                                              "en-US",
                                              {
                                                  weekday: "short",
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              }
                                          )} - {new Date(event.date.endDate).toLocaleDateString(
                                              "en-US",
                                              {
                                                  weekday: "short",
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              }
                                          )}</Text>
                <Text style={globalStyles.paragraph}>{event.location}</Text>
                <Text style={globalStyles.paragraph}>{event.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default EventTile;

const styles = StyleSheet.create({
    itemGuest: {
        margin: 10,
        borderWidth: 2,
        borderColor: "dodgerblue",
        padding: 10,
        borderRadius: 10,
    },
    itemHost: {
        margin: 10,
        borderWidth: 2,
        borderColor: "#cb6ce6",
        backgroundColor: "plum",
        padding: 10,
        borderRadius: 10,
    },
    eventHeader: {
        fontSize: 18,
        fontWeight: "bold",
    },
    eventSubHeader: {
        fontSize: 16,
        fontWeight: "bold",
    },
    eventDesc: {
        fontSize: 14,
    },
});
