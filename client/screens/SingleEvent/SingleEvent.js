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
    const today = new Date();

    // PROPS & PARAMS
    const uid = params.route.params.uid;
    const event = params.route.params.event;
    const attending = event.guestList[uid].attending;

    // USESTATE
    const [host, setHost] = useState({});
    const [user, setUser] = useState({});
    const [userName, setUserName] = useState({});
    const [userEventId, setUserEventId] = useState("");
    const [countdown, setCountDown] = useState("");

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

    useEffect(() => {
        const timeleft = new Date(event.startDate) - today;
        const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        setCountDown(days);
    }, []);

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
                    style={styles.coverPhoto}
                />
                {today < new Date(event.startDate) && countdown > 1 ? (
                    <View style={styles.daysAway}>
                        <Text style={styles.countdownText}>{countdown}</Text>
                        <Text style={styles.countdownSubtext}>days away</Text>
                    </View>
                ) : today < new Date(event.startDate) && countdown === 1 ? (
                    <View style={styles.daysAway}>
                        <Text style={styles.countdownText}>{countdown}</Text>
                        <Text style={styles.countdownSubtext}>day away</Text>
                    </View>
                ) : countdown === 0 ? (
                    <View style={styles.tomorrow}>
                        <Text style={styles.countdownText}>Tomorrow!</Text>
                    </View>
                ) : null}
                {uid === event.host_id && today < new Date(event.startDate) ? (
                    <>
                        <View style={styles.hostControls}>
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
                                                <Text style={styles.hostBtn}>
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
                                                <Text style={styles.hostBtn}>
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
                                                    name="alarm-outline"
                                                    size={25}
                                                />
                                                <Text style={styles.hostBtn}>
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
                <Text style={styles.eventTitle}>{event.name}</Text>
                <Text style={styles.hostedBy}>
                    hosted by {host.firstName} {host.lastName}
                </Text>
                <Text style={styles.dates}>
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
                <Text style={styles.times}>
                    {event.startTime} - {event.endTime}
                </Text>
                <Text style={styles.times}>{event.mainLocation}</Text>
                <Text style={styles.description}>{event.description}</Text>
                <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    {uid != event.host_id && (
                        <View
                            style={{
                                ...styles.myRSVP,
                                backgroundColor: attending
                                    ? "#38b6ff"
                                    : "black",
                                borderRadius: attending === true ? 300 : 0,
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
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontFamily: "Bukhari Script",
                                    color: "white",
                                }}
                            >
                                {attending === true
                                    ? `I'll be there`
                                    : `Can't make it`}
                            </Text>
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
                        <Ionicons
                            name="people-outline"
                            size={25}
                            color="#5DA4F9"
                        />
                        <Text
                            style={{
                                ...globalStyles.heading3,
                                color: "#5DA4F9",
                            }}
                        >
                            Guest List
                        </Text>
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
                        <Ionicons
                            name="map-outline"
                            size={25}
                            color="#8291F3"
                        />
                        <Text
                            style={{
                                ...globalStyles.heading3,
                                color: "#8291F3",
                            }}
                        >
                            Maps and Events
                        </Text>
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
                        <Ionicons
                            name="chatbubbles-outline"
                            size={25}
                            color="#A67FEC"
                        />
                        <Text
                            style={{
                                ...globalStyles.heading3,
                                color: "#A67FEC",
                            }}
                        >
                            Message Board
                        </Text>
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
                        <Ionicons
                            name="camera-outline"
                            size={25}
                            color="#CB6CE6"
                        />
                        <Text
                            style={{
                                ...globalStyles.heading3,
                                color: "#CB6CE6",
                            }}
                        >
                            Gallery
                        </Text>
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
    tomorrow: {
        ...globalStyles.heading3,
        width: 100,
        height: 100,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CB6CE6",
        position: "absolute",
        right: 20,
        top: 20,
    },
    daysAway: {
        ...globalStyles.heading3,
        width: 100,
        height: 100,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#38b6ff",
        position: "absolute",
        right: 10,
        top: 10,
    },
    countdownText: {
        ...globalStyles.heading3,
        textAlign: "center",
        color: "white",
    },
    countdownSubtext: {
        ...globalStyles.paragraph,
        fontWeight: "bold",
        color: "white",
    },
    hostControls: {
        flexDirection: "row",
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        padding: 8,
        backgroundColor: "black",
    },
    coverPhoto: {
        flex: 1,
        width: "100%",
        height: 200,
    },
    hostBtn: {
        ...globalStyles.paragraph,
        textAlign: "center",
        fontWeight: "bold",
    },
    eventTitle: {
        fontFamily: "Bukhari Script",
        fontSize: 30,
        padding: 5,
        marginTop: 12,
        marginLeft: 12,
        marginRight: 12,
    },
    hostedBy: {
        fontSize: 15,
        marginLeft: 12,
        marginRight: 12,
    },
    dates: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 5,
        marginLeft: 12,
        marginRight: 12,
    },
    times: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 5,
        marginLeft: 12,
        marginRight: 12,
    },
    description: {
        fontSize: 15,
        marginTop: 5,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 20,
    },
    myRSVP: {
        justifyContent: "center",
        alignItems: "center",
        height: 80,
        width: 300,
        marginBottom: 20,
    },
});
