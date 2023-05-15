//Nataly was here
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    FlatList,
    Dimensions,
} from "react-native";
import { getDatabase, ref, child, get } from "firebase/database";
import Ionicons from "react-native-vector-icons/Ionicons";
import globalStyles from "../../utils/globalStyles";
import Banner from "../../../assets/Banner.png";

const SingleEvent = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const uid = params.route.params.uid;
    console.log("users unique id --> ", params.route.params.uid);
    console.log(event);
    useEffect(() => {
        setEvent(params.route.params.event);
    }, [params.route.params.event]);

    const navigation = useNavigation();

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView>
                <Image
                    source={
                        !event.eventPhoto ? Banner : { uri: event.eventPhoto }
                    }
                    resizeMode="cover"
                    style={{
                        flex: 1,
                        width: "100%",
                        height: 200,
                    }}
                />
                <Text
                    style={{
                        fontFamily: "Bukhari Script",
                        fontSize: 30,
                        marginTop: 12,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                >
                    {event.name}
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginTop: 5,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                >
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
                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        marginTop: 5,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                >
                    {event.location}
                </Text>
                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        marginTop: 5,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                >
                    {event.startTime} & {event.endTime}
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        marginTop: 5,
                        marginLeft: 12,
                        marginRight: 12,
                        marginBottom: 20,
                    }}
                >
                    {event.description}
                </Text>
                <TouchableOpacity
                    style={{ ...styles.tile, borderColor: "#38B6FF" }}
                    onPress={() =>
                        navigation.navigate("GuestProfileScreen", {
                            eventId: event.id,
                        })
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="happy-outline" size={25} />
                        <Text>My Guest Profile</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ ...styles.tile, borderColor: "#5DA4F9" }}
                    onPress={() =>
                        navigation.navigate("GuestListScreen", {
                            event: event,
                        })
                    }
                >
                    <Text>Guest List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ ...styles.tile, borderColor: "#8291F3" }}
                    onPress={() =>
                        navigation.navigate("Maps", { eventId: event.event_id || "0", eventHost: event.host_id })
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="map-outline" size={25} />
                        <Text>Maps and Events</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ ...styles.tile, borderColor: "#8291F3" }}
                    onPress={() =>
                        navigation.navigate("Maps", { eventId: event.event_id || "0", eventHost: event.host_id }) 
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="map-outline" size={25} />
                        <Text>Maps and Events</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ ...styles.tile, borderColor: "#A67FEC" }}
                    onPress={() =>
                        navigation.navigate("MessageboardScreen", {
                            event_id: event.event_id,
                            eventMessages: event.messages,
                            name: event.name,
                            user_id: params.route.params.uid,
                        })
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="chatbubbles-outline" size={25} />
                        <Text>Message Board</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ ...styles.tile, borderColor: "#CB6CE6" }}
                    onPress={() =>
                        navigation.navigate("EventGallery", {
                            event: event,
                            uid: uid,
                        })
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="camera-outline" size={25} />
                        <Text>Gallery</Text>
                    </View>
                </TouchableOpacity>
                {uid === event.host_id ? (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Edit Event", {
                                event: event,
                            })
                        }
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "baseline",
                                marginTop: 5,
                                marginLeft: 12,
                                marginRight: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                }}
                            >
                                Edit Your Event{" "}
                            </Text>
                            <Ionicons name="create-outline" size={25} />
                        </View>
                    </TouchableOpacity>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SingleEvent;

const screenWidth = Dimensions.get("window").width;

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
        marginTop: 12,
        marginRight: 12,
        marginLeft: 12,
        height: 60,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
});
