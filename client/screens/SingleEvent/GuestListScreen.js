import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Image,
    Dimensions,
    SafeAreaView, ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video } from "expo-av";
import {
    getDatabase,
    ref,
    child,
    get,
    query,
    remove,
    orderByChild,
    equalTo,
} from "firebase/database";
import { auth } from "../../../firebase";
import globalStyles from "../../utils/globalStyles";

const GuestListScreen = (params) => {
    // COMPONENT VARIABLES
    const isFocused = useIsFocused();
    const dbRef = ref(getDatabase());
    const navigation = useNavigation();
    const screenWidth = Dimensions.get("window").width;

    // PROPS & PARAMS
    const event = params.route.params.event;
    const host_id = event.host_id;
    const eventId = event.event_id;

    // USESTATE
    const [loading, setLoading] = useState(true);
    const [guestList, setGuestList] = useState([]);
    const [host, setHost] = useState({});
    const [userId, setUserId] = useState("");

    const getGuests = async () => {
        let guestIds = [];
        let guests = [];
        try {
            const guestsQuery = query(
                child(dbRef, `events/${eventId}/guestList`)
            );
            await get(guestsQuery).then((guestsSnapshot) => {
                if (guestsSnapshot.exists()) {
                    const data = guestsSnapshot.val();
                    guestIds = Object.keys(data);
                } else {
                    console.log("no guest data found");
                }
            });
        } catch (error) {
            console.log(error);
        }
        for (let i = 0; i < guestIds.length; i++) {
            const guestQuery = query(child(dbRef, `users/${guestIds[i]}`));
            try {
                await get(guestQuery)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            const attendingStatus = Object.values(
                                data.userEvents
                            ).find(({ event_id }) => event_id === eventId);
                            const neededInfo = {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                profilePic: data.profilePic,
                                userEvent: attendingStatus,
                                user_id: data.user_id,
                            };
                            guests = [...guests, neededInfo];
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
        }
        setGuestList(guests);
        setLoading(false);
    };

    const getHost = async () => {
        const hostQuery = query(child(dbRef, `users/${host_id}`));
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

    useEffect(() => {
        const getUserId = async () => {
            const currentUserId = auth.currentUser.uid;
            const dbRef = ref(getDatabase());
            const usersQuery = query(
                child(dbRef, "users"),
                orderByChild("auth_id"),
                equalTo(currentUserId)
            );
            const snapshot = await get(usersQuery);

            if (snapshot.exists()) {
                const data = Object.keys(snapshot.val());
                setUserId(data[0]);
            }
        };
        getUserId();
        getGuests();
        getHost();
    }, [isFocused]);

    const handleDeleteGuest = async (guest, key) => {
        const dbRef = ref(getDatabase());
        const guestListRef = child(dbRef, `events/${eventId}/guestList`);
        const userId = guest.user_id;

        const guestToDeleteRef = child(guestListRef, userId);
        await remove(guestToDeleteRef);

        const usersEventsRef = child(dbRef, `users/${userId}/userEvents}`);

        const eventToDeleteRef = child(usersEventsRef, guest.userEvent);
        await remove(eventToDeleteRef);

        const updatedGuestList = guestList.filter(
            (item) => item.user_id !== userId
        );
        setGuestList(updatedGuestList);
    };

    const showAttending = async () => {
        let guestIds = [];
        let guests = [];
        try {
            const guestsQuery = query(
                child(dbRef, `events/${eventId}/guestList`)
            );
            await get(guestsQuery).then((guestsSnapshot) => {
                if (guestsSnapshot.exists()) {
                    const data = guestsSnapshot.val();
                    guestIds = Object.keys(data);
                } else {
                    console.log("no guest data found");
                }
            });
        } catch (error) {
            console.log(error);
        }
        for (let i = 0; i < guestIds.length; i++) {
            const guestQuery = query(child(dbRef, `users/${guestIds[i]}`));
            try {
                await get(guestQuery)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            const attendingStatus = Object.values(
                                data.userEvents
                            ).find(({ event_id }) => event_id === eventId);
                            const neededInfo = {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                profilePic: data.profilePic,
                                userEvent: attendingStatus,
                                user_id: data.user_id,
                            };
                            guests = [...guests, neededInfo];
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
        }
        setGuestList(
            guests.filter((guest) => guest.userEvent.attending === true)
        );
    };

    const showNotAttending = async () => {
        let guestIds = [];
        let guests = [];
        try {
            const guestsQuery = query(
                child(dbRef, `events/${eventId}/guestList`)
            );
            await get(guestsQuery).then((guestsSnapshot) => {
                if (guestsSnapshot.exists()) {
                    const data = guestsSnapshot.val();
                    guestIds = Object.keys(data);
                } else {
                    console.log("no guest data found");
                }
            });
        } catch (error) {
            console.log(error);
        }
        for (let i = 0; i < guestIds.length; i++) {
            const guestQuery = query(child(dbRef, `users/${guestIds[i]}`));
            try {
                await get(guestQuery)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            const attendingStatus = Object.values(
                                data.userEvents
                            ).find(({ event_id }) => event_id === eventId);
                            const neededInfo = {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                profilePic: data.profilePic,
                                userEvent: attendingStatus,
                                user_id: data.user_id,
                            };
                            guests = [...guests, neededInfo];
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
        }
        setGuestList(
            guests.filter((guest) => guest.userEvent.attending === false)
        );
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            {/* <ScrollView> */}
                {loading ? (
                    <Video
                        source={require("../../../assets/LoadingScreen.mp4")}
                        style={{ flex: 1 }}
                        shouldPlay
                        isLooping
                        resizeMode="cover"
                    />
                ) : (
                    <>
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 12,
                            }}
                        >
                            <Text style={globalStyles.heading2}>
                                Invitees of
                            </Text>
                            <Text
                                style={{
                                    ...globalStyles.heading1,
                                    fontFamily: "Bukhari Script",
                                    padding: 10,
                                    textAlign: "center",
                                }}
                            >
                                {event.name}
                            </Text>
                            <Text style={globalStyles.heading3}>
                                Hosted by: {host.firstName} {host.lastName}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 20,
                                marginBottom: 35,
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 100,
                                    width: 100,
                                    borderRadius: 80,
                                    margin: 10,
                                    backgroundColor: "black",
                                }}
                            >
                                <Text
                                    style={{
                                        ...globalStyles.paragraph,
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                    onPress={getGuests}
                                >
                                    All{"\n"}invitees
                                </Text>
                            </View>
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 100,
                                    width: 100,
                                    borderRadius: 80,
                                    margin: 10,
                                    backgroundColor: "#38b6ff",
                                }}
                            >
                                <Text
                                    style={{
                                        ...globalStyles.paragraph,
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                    onPress={showAttending}
                                >
                                    Will{"\n"}be there
                                </Text>
                            </View>
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 100,
                                    width: 100,
                                    borderRadius: 80,
                                    margin: 10,
                                    backgroundColor: "#cb6ce6",
                                }}
                            >
                                <Text
                                    style={{
                                        ...globalStyles.paragraph,
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                    onPress={showNotAttending}
                                >
                                    Can't{"\n"}make it
                                </Text>
                            </View>
                            {/* <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: 80,
                                width: 80,
                                borderRadius: 80,
                                margin: 10,
                                backgroundColor: "lightgray",
                            }}
                        >
                            <Text
                                style={{
                                    ...globalStyles.paragraph,
                                    textAlign: "center",
                                    color: "black",
                                    fontWeight: "bold",
                                }}
                                onPress={showNotResponded}
                            >
                                RSVP pending
                            </Text>
                        </View> */}
                        </View>
                        <View style={{ alignItems: "center" }}>
                            {guestList.length > 0 ? (
                                <FlatList
                                    data={Object.keys(guestList)}
                                    numColumns={3}
                                    renderItem={({ item: key }) => {
                                        const guest = guestList[key];
                                        return (
                                            <View
                                                key={key}
                                                style={{
                                                    width: screenWidth / 3 - 20,
                                                    margin: 5,
                                                    padding: 5,
                                                    position: "relative",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {userId === event.host_id ? (
                                                    <TouchableOpacity
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: 0,
                                                            right: 0,
                                                            zIndex: 5,
                                                        }}
                                                        onPress={() =>
                                                            handleDeleteGuest(
                                                                guest,
                                                                key
                                                            )
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="close-circle-outline"
                                                            size={25}
                                                        />
                                                    </TouchableOpacity>
                                                ) : null}
                                                <View
                                                    style={{
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {guest.profilePic === "" ? (
                                                        <View
                                                            style={{
                                                                ...styles.profilePic,
                                                                marginBottom: 10,
                                                                borderWidth: 8,
                                                                borderColor:
                                                                    guest
                                                                        .userEvent
                                                                        .attending
                                                                        ? "#36b6ff"
                                                                        : "#cb6ce6",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Ionicons
                                                                name="person-outline"
                                                                size={55}
                                                                color={
                                                                    guest
                                                                        .userEvent
                                                                        .attending
                                                                        ? "#36b6ff"
                                                                        : "#cb6ce6"
                                                                }
                                                            />
                                                        </View>
                                                    ) : (
                                                        <Image
                                                            style={{
                                                                ...styles.profilePic,
                                                                marginBottom: 10,
                                                                borderWidth: 8,
                                                                borderColor:
                                                                    guest
                                                                        .userEvent
                                                                        .attending
                                                                        ? "#36b6ff"
                                                                        : "#cb6ce6",
                                                            }}
                                                            source={{
                                                                uri: guest.profilePic,
                                                            }}
                                                        />
                                                    )}
                                                    <View
                                                        style={{
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                ...globalStyles.paragraph,
                                                                overflow:
                                                                    "hidden",
                                                            }}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {guest.firstName}{" "}
                                                            {guest.lastName}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    }}
                                    keyExtractor={(key) => key} // Use the 'key' as the unique identifier
                                />
                            ) : (
                                <Text>No guests at this time!</Text>
                            )}
                        </View>
                    </>
                )}
            {/* </ScrollView> */}
        </SafeAreaView>
    );
};

export default GuestListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        width: "80%",
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    button: {
        backgroundColor: "#0782F9",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonOutline: {
        backgroundColor: "white",
        marginTop: 5,
        borderColor: "#0782F9",
        borderWidth: 2,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    buttonOutlineText: {
        color: "#0782F9",
        fontWeight: "700",
        fontSize: 16,
    },
    guestContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: "red",
        borderRadius: 10,
        padding: 5,
        marginRight: 10,
    },
    deleteButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    guestName: {
        fontSize: 16,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 100,
        resizeMode: "cover",
    },
});
