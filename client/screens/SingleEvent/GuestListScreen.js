import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, child, get, query, remove } from "firebase/database";
import { useIsFocused } from "@react-navigation/native";
import { FlatList } from "react-native-web";

const GuestListScreen = (params) => {
    const [guestList, setGuestList] = useState([]);
    const [host, setHost] = useState({});
    const event = params.route.params.event;
    const uid = params.route.params.uid;
    const host_id = event.host_id;
    const eventId = event.event_id;

    const isFocused = useIsFocused();
    const dbRef = ref(getDatabase());

    const navigation = useNavigation();

    useEffect(() => {
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
                                guests = [...guests, data];
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

        getGuests();
        getHost();
    }, [isFocused, setGuestList]);

    const handleDeleteGuest = async (guest, key) => {
        const dbRef = ref(getDatabase());
        const guestListRef = child(dbRef, `events/${eventId}/guestList`);
        const userId = guest.user_id;

        const guestToDeleteRef = child(guestListRef, userId);
        await remove(guestToDeleteRef);
        
        const usersEventsRef = child(dbRef, `users/${userId}/userEvents`);
        const eventToDeleteRef = child(usersEventsRef, eventId)
        await remove(eventToDeleteRef);

        const updatedGuestList = guestList.filter((item) => item.user_id !== userId);
        setGuestList(updatedGuestList);
    };

    return (
        <View style={styles.container}>
            <Text>Guest List</Text>
            <Text>
                Host: {host.firstName} {host.lastName}
            </Text>
            {guestList.length > 0 ? (
                uid === event.host_id ? (
                    Object.keys(guestList).map((key) => {
                        const guest = guestList[key];
                        return (
                            <View key={key} style={styles.guestContainer}>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteGuest(guest, key)}
                                >
                                    <Text style={styles.deleteButtonText}>
                                        x
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(
                                            "GuestProfileScreen",
                                            { user: guest }
                                        )
                                    }
                                >
                                    <Text style={styles.guestName}>
                                        {guest.firstName} {guest.lastName}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                ) : (
                    Object.keys(guestList).map((key) => {
                        const guest = guestList[key];
                        return (
                            <TouchableOpacity
                                key={key}
                                onPress={() =>
                                    navigation.navigate("GuestProfileScreen", {
                                        user: guest,
                                    })
                                }
                            >
                                <Text style={styles.guestName}>
                                    {guest.firstName} {guest.lastName}
                                </Text>
                            </TouchableOpacity>
                        );
                    })
                )
            ) : (
                <Text>No guests at this time!</Text>
            )}
        </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 5,
        marginRight: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    guestName: {
        fontSize: 16,
    },
});
