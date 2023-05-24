// REACT IMPORTS
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
const Backgroundhorizontal = require("../../../assets/Backgroundhorizontal.png");

const PastEvent = ({ event, uid }) => {
    // COMPONENT VARIABLES
    const navigation = useNavigation();

    // PROPS & PARAMS
    const eventData = event.item;
    // const event = props.route.params.event;
    // const uid = props.route.params.uid

    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("SingleEvent", {
                    uid: uid,
                    event: eventData,
                })
            }
        >
            {uid === eventData.host_id ? (
                <View style={styles.imageContainer}>
                    <View style={styles.borderContainer}>
                        <ImageBackground
                            source={Backgroundhorizontal}
                            resizeMode="cover"
                            style={styles.imageBG}
                        >
                            <View key={eventData.event_id}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text style={globalStyles.heading2}>
                                        {eventData.name}
                                    </Text>
                                </View>
                                <Text style={globalStyles.heading3}>
                                    {new Date(
                                        eventData.startDate
                                    ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                        eventData.endDate
                                    ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </Text>
                                <Text style={globalStyles.paragraph}>
                                    {eventData.mainLocation}
                                </Text>
                                <Text style={globalStyles.paragraph}>
                                    {eventData.description}
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            ) : (
                <View key={eventData.event_id} style={styles.itemGuest}>
                    <Text style={globalStyles.heading2}>{eventData.name}</Text>
                    <Text style={globalStyles.heading3}>
                        {new Date(eventData.startDate).toLocaleDateString(
                            "en-US",
                            {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }
                        )}{" "}
                        -{" "}
                        {new Date(eventData.endDate).toLocaleDateString(
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
                        {eventData.mainLocation}
                    </Text>
                    <Text style={globalStyles.paragraph}>
                        {eventData.description}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default PastEvent;

const styles = StyleSheet.create({
    itemGuest: {
        borderWidth: 2,
        borderLeftColor: "#38b6ff",
        borderTopColor: "#38b6ff",
        borderRightColor: "#cb6ce6",
        borderBottomColor: "#cb6ce6",
        borderRadius: 10,
        flex: 1,
        marginTop: 12,
        marginRight: 12,
        marginLeft: 12,
        padding: 20,
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
    imageBG: {
        flex: 1,
        padding: 20,
    },
});
