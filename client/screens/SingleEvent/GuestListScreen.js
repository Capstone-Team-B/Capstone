import { useNavigation } from "@react-navigation/core";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    getDatabase,
    ref,
    child,
    get,
    query,
} from "firebase/database";
import { useIsFocused } from "@react-navigation/native";
import { FlatList } from "react-native-web";

const GuestListScreen = (params) => {
    const [guestUsers, setGuestUsers] = useState([]);
    const [host, setHost] = useState({});
    const event = params.route.params.event;
    const host_id = event.host_id;
    const guestList = event.guestList;
    const guestIds = Object.values(guestList);
    const isFocused = useIsFocused();
    const dbRef = ref(getDatabase());

    const navigation = useNavigation();

    useEffect(() => {
        const getGuests = async () => {
            let guests = [];
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
            setGuestUsers(guests);
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
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <Text> Guest list</Text>
            <Text>Host: {host.firstName} {host.lastName}</Text>
            {guestUsers ? (
                // NEED TO MAKE INTO <FlatList />
                Object.keys(guestUsers).map((key) => {
                    const guest = guestUsers[key];
                    return (
                        <TouchableOpacity
                            key={key}
                            onPress={() =>
                                navigation.navigate("GuestProfileScreen", { user: guest })
                            }
                        >
                            <Text>
                                {guest.firstName} {guest.lastName}
                            </Text>
                        </TouchableOpacity>
                    );
                })
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
});
