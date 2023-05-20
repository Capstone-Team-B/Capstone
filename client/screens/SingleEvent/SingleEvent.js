// REACT IMPORTS
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    ImageBackground,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
// FIREBASE IMPORTS
import { getDatabase, ref, child, get, query } from "firebase/database";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
import Backgroundhorizontal from "../../../assets/Backgroundhorizontal.png";

const screenWidth = Dimensions.get("window").width;

const SingleEvent = (params) => {
    // COMPONENT VARIABLES
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const dbRef = ref(getDatabase());

    // PROPS & PARAMS
    const uid = params.route.params.uid;
    const event = params.route.params.event;
    const attending = event.guestList[uid].attending;

    // USESTATE
    const [host, setHost] = useState({});
    const [user, setUser] = useState({});
    const [userName, setUserName] = useState({});
    const [userEventId, setUserEventId] = useState("");

    // USEEFFECT
    useEffect(() => {
        const getUser = () => {
            get(child(dbRef, `users/${uid}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setUser(userData);
                        setUserName(
                            `${userData.firstName} ${userData.lastName}`
                        );
                        const userEvents = userData.userEvents;
                        const filteredKey = Object.entries(userEvents).find(
                            ([key, value]) => value.event_id === event.event_id
                        )[0];
                        setUserEventId(filteredKey);
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        getUser();
    }, [isFocused, navigation]);
    useEffect(() => {
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
    }, [isFocused, navigation]);

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView>
                <Image
                    source={
                        !event.eventPhoto
                            ? Backgroundhorizontal
                            : { uri: event.eventPhoto }
                    }
                    resizeMode="cover"
                    style={{
                        flex: 1,
                        width: "100%",
                        height: 200,
                    }}
                />
                {uid === event.host_id ? (
                    <>
                        {/* <View
                            style={{
                                paddingTop: 12,
                                backgroundColor: "black",
                            }}
                        >
                            <Text
                                style={{
                                    ...globalStyles.heading2,
                                    textAlign: "center",
                                    color: "white",
                                }}
                            >
                                Manage my event
                            </Text>
                        </View> */}
                        <View
                            style={{
                                flexDirection: "row",
                                marginBottom: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 2,
                                padding: 8,
                                backgroundColor: "black",
                            }}
                        >
                            <View style={styles.imageContainer}>
                                <View style={styles.borderContainer}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate("Edit Event", {
                                                event: event,
                                                uid: uid,
                                            })
                                        }
                                    >
                                        <View
                                            style={
                                                styles.imageBackgroundWrapper
                                            }
                                        >
                                            <ImageBackground
                                                source={Backgroundhorizontal}
                                                resizeMode="cover"
                                                style={styles.imageBackground}
                                            >
                                                <Ionicons
                                                    name="create-outline"
                                                    size={25}
                                                />
                                                <Text
                                                    style={{
                                                        ...globalStyles.paragraph,
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Edit event
                                                </Text>
                                            </ImageBackground>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.imageContainer}>
                                <View style={styles.borderContainer}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate(
                                                "Create Guest List",
                                                {
                                                    event: event,
                                                    uid: uid,
                                                }
                                            )
                                        }
                                    >
                                        <View
                                            style={
                                                styles.imageBackgroundWrapper
                                            }
                                        >
                                            <ImageBackground
                                                source={Backgroundhorizontal}
                                                resizeMode="cover"
                                                style={styles.imageBackground}
                                            >
                                                <Ionicons
                                                    name="mail-outline"
                                                    size={25}
                                                />
                                                <Text
                                                    style={{
                                                        ...globalStyles.paragraph,
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Invite guests
                                                </Text>
                                            </ImageBackground>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.imageContainer}>
                                <View style={styles.borderContainer}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate(
                                                "All Reminders",
                                                {
                                                    event: event,
                                                    uid: uid,
                                                }
                                            )
                                        }
                                    >
                                        <View
                                            style={
                                                styles.imageBackgroundWrapper
                                            }
                                        >
                                            <ImageBackground
                                                source={Backgroundhorizontal}
                                                resizeMode="cover"
                                                style={styles.imageBackground}
                                            >
                                                <Ionicons
                                                    name="alarm-outline"
                                                    size={25}
                                                />
                                                <Text
                                                    style={{
                                                        ...globalStyles.paragraph,
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Create{"\n"}reminders
                                                </Text>
                                            </ImageBackground>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </>
                ) : null}
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

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {uid != event.host_id && (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: 80,
                                backgroundColor: attending
                                    ? "#38b6ff"
                                    : "black",
                                width: 300,
                                borderRadius: attending === true ? 300 : 0,
                                marginBottom: 20,
                            }}
                        >
                            <Text
                                style={{
                                    ...globalStyles.heading3,
                                    color: "white",
                                }}
                            >
                                My RSVP
                            </Text>
                            {
                                attending === true ? (
                                    <Text
                                        style={{
                                            fontSize: 25,
                                            fontFamily: "Bukhari Script",
                                            color: "white",
                                        }}
                                    >
                                        I'll be there
                                    </Text>
                                ) : (
                                    <Text
                                        style={{
                                            fontSize: 25,
                                            fontFamily: "Bukhari Script",
                                            color: "white",
                                        }}
                                    >
                                        Can't make it
                                    </Text>
                                )
                                // : attending === undefined ? (
                                //     <Text
                                //         style={{
                                //             fontSize: 25,
                                //             fontFamily: "Bukhari Script",
                                //             color: "black",
                                //         }}
                                //     >
                                //         RSVP pending
                                //     </Text>
                                // )
                            }
                        </View>
                    )}
                </View>
                {uid != event.host_id && (
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
                                userEventId: userEventId,
                            })
                        }
                    >
                        <View style={{ alignItems: "center" }}>
                            <Ionicons name="happy-outline" size={25} />
                            <Text>Update RSVP Status</Text>
                        </View>
                    </TouchableOpacity>
                )}

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
                            attending: attending,
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
                            uid: params.route.params.uid,
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
                            userName: `${user.firstName} ${user.lastName}`,
                        })
                    }
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name="camera-outline" size={25} />
                        <Text>Gallery</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
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
    imageContainer: {
        flex: 1,
    },
    borderContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "black",
    },
    imageBackgroundWrapper: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
        margin: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    imageBackground: {
        flex: 1,
        width: screenWidth / 3,
        height: screenWidth / 4,
        justifyContent: "center",
        alignItems: "center",
    },
});
