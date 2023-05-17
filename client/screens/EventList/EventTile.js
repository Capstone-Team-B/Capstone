import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import globalStyles from "../../utils/globalStyles";
const Backgroundhorizontal = require("../../../assets/Backgroundhorizontal.png");
import Ionicons from "react-native-vector-icons/Ionicons";

const EventTile = ({ event, uid }) => {
    const navigation = useNavigation();
    console.log("eventTile", event)
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("SingleEvent", { event })}
        >
            {uid === event.host_id ? (
                <View style={styles.imageContainer}>
                    <View style={styles.borderContainer}>
                        <ImageBackground
                            source={Backgroundhorizontal}
                            resizeMode="cover"
                            style={{
                                flex: 1,
                                padding: 20,
                            }}
                        >
                            <View key={event.id}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text style={globalStyles.heading2}>
                                        {event.name}
                                    </Text>
                                    <Ionicons name="star-outline" size={25} />
                                </View>
                                <Text style={globalStyles.heading3}>
                                    {new Date(
                                        event.startDate
                                    ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}{" "}
                                    -{" "}
                                    {new Date(event.endDate).toLocaleDateString(
                                        "en-US",
                                        {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                </Text>
                                <Text style={globalStyles.paragraph}>
                                    {event.location}
                                </Text>
                                <Text style={globalStyles.paragraph}>
                                    {event.description}
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            ) : (
                <View key={event.id} style={styles.itemGuest}>
                    <Text style={globalStyles.heading2}>{event.name}</Text>
                    <Text style={globalStyles.heading3}>
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
                    <Text style={globalStyles.paragraph}>{event.location}</Text>
                    <Text style={globalStyles.paragraph}>
                        {event.description}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default EventTile;

const styles = StyleSheet.create({
    itemGuest: {
        margin: 12,
        borderWidth: 2,
        borderLeftColor: "#38b6ff",
        borderTopColor: "#38b6ff",
        borderRightColor: "#cb6ce6",
        borderBottomColor: "#cb6ce6",
        padding: 20,
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
    imageContainer: {
        flex: 1,
        marginTop: 12,
        marginRight: 12,
        marginLeft: 12,
    },
    borderContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "white",
    },
});
