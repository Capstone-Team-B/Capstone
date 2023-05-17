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
import { getDatabase, ref, child, get, query } from "firebase/database";
import Ionicons from "react-native-vector-icons/Ionicons";
import globalStyles from "../../utils/globalStyles";
import Banner from "../../../assets/Banner.png";

const SingleEvent = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    const [host, setHost] = useState({});
    const uid = params.route.params.uid;
    const [userName, setUserName] = useState({});

    useEffect(() => {
        setEvent(params.route.params.event);
    }, [params.route.params.event, event.guestList[uid].attending]);

    // useEffect to get all logged-in user info to pass along with image upload
    useEffect(() => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setUserName(
                        `${snapshot.val().firstName} ${snapshot.val().lastName}`
                    );
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [event.guestList[uid].attending]);

    useEffect(() => {
        const dbRef = ref(getDatabase());
        const getHost = async () => {
            const hostQuery = query(child(dbRef, `users/${event.host_id}`));
            try {
                await get(hostQuery)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            setHost(data);
                        } else {
                            console.log("No data available");
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } catch (error) {
                console.log(error);
            }
        };
        getHost();
    }, []);

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
                        padding: 5,
                        marginTop: 12,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                >
                    {event.name}
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                >
                    hosted by {host.firstName} {host.lastName}
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
                    {event.startTime} & {event.endTime}
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
                    {event.mainLocation}
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
                {event.guestList[uid].attending ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            height: 80,
                            backgroundColor: "#38b6ff",
                        }}
                    >
                        <Text style={{...globalStyles.heading2, color: "white"}}>My RSVP:{"   "}</Text>
                        <Text style={{fontSize: 25, fontFamily: "Bukhari Script", color: "white"}}>I'll be there</Text>
                    </View>
                ) : (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            height: 80,
                            backgroundColor: "black",
                            marginBottom: 15
                        }}
                    >
                        <Text style={{...globalStyles.heading2, color: "white"}}>My RSVP:{"   "}</Text>
                        <Text style={{fontSize: 25, fontFamily: "Bukhari Script", color: "white"}}>Can't make it</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={{
                        ...globalStyles.button,
                        borderWidth: 2,
                        marginBottom: 5,
                        borderColor: "#38B6FF",
                    }}
                    onPress={() =>
                        navigation.navigate("GuestProfileScreen", {
                            event: event,
                            uid: uid,
                        })
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="happy-outline" size={25} />
                        <Text>Update RSVP Status</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        ...globalStyles.button,
                        borderWidth: 2,
                        marginBottom: 5,
                        borderColor: "#5DA4F9",
                    }}
                    onPress={() =>
                        navigation.navigate("GuestListScreen", {
                            event: event,
                        })
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="people-outline" size={25} />
                        <Text>Guest List</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        ...globalStyles.button,
                        borderWidth: 2,
                        marginBottom: 5,
                        borderColor: "#8291F3",
                    }}
                    onPress={() =>
                        navigation.navigate("Maps", {
                            eventId: event.event_id || "0",
                            eventHost: event.host_id,
                        })
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="map-outline" size={25} />
                        <Text>Maps and Events</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        ...globalStyles.button,
                        borderWidth: 2,
                        marginBottom: 5,
                        borderColor: "#A67FEC",
                    }}
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
                    style={{
                        ...globalStyles.button,
                        borderWidth: 2,
                        marginBottom: 5,
                        borderColor: "#CB6CE6",
                    }}
                    onPress={() =>
                        navigation.navigate("EventGallery", {
                            event: event,
                            uid: uid,
                            userName: userName,
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
                                ...globalStyles.button,
                                backgroundColor: "#CB6CE6",
                            }}
                        >
                            <Ionicons
                                name="create-outline"
                                size={25}
                                color={"white"}
                            />
                            <Text
                                style={{
                                    ...globalStyles.paragraph,
                                    color: "white",
                                }}
                            >
                                Edit Your Event{" "}
                            </Text>
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
