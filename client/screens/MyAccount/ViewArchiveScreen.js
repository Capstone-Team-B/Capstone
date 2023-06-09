// REACT IMPORTS
import {
    View,
    Text,
    SafeAreaView,
    Image,
    FlatList,
    TouchableOpacity, StyleSheet
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
// EXPO IMPORTS
import { Video } from "expo-av";
// FIREBASE IMPORTS
import {
    getDatabase,
    ref,
    child,
    get,
    query,
    orderByChild,
} from "firebase/database";
// import { auth } from "../../../firebase";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
import PastEvent from "./PastEvent";
const BeThereConcise = require("../../../assets/BeThereConcise.png");

const ViewArchiveScreen = (params) => {
    // COMPONENT VARIABLES
    const isFocused = useIsFocused();
    const dbRef = ref(getDatabase());
    const navigation = useNavigation();

    // STATE
    const [eventList, setEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(params.route.params.uid);

    // USEEFFECT
    useEffect(() => {
        // const getUserId = async () => {
        //     const currentUserId = auth.currentUser.uid;
        //     const dbRef = ref(getDatabase());
        //     const usersQuery = query(
        //         child(dbRef, "users"),
        //         orderByChild("auth_id"),
        //         equalTo(currentUserId)
        //     );
        //     const snapshot = await get(usersQuery);

        //     if (snapshot.exists()) {
        //         const data = Object.keys(snapshot.val());
        //         setUserId(data[0]);
        //     }
        // };
        // getUserId();
        const checkUserEvents = child(dbRef, `users/${userId}/userEvents`);
        if (!checkUserEvents) {
            return setLoading(false);
        }
        const eventIdsQuery = query(
            child(dbRef, `users/${userId}`),
            orderByChild("userEvents")
        );
        try {
            get(eventIdsQuery).then((eventSnapshot) => {
                if (eventSnapshot.exists()) {
                    const data = eventSnapshot.val();
                    if (data.userEvents) {
                        const objVal = Object.values(data.userEvents);
                        const userEventIds = objVal.map(
                            (event) => event.event_id
                        );
                        getEvents(userEventIds);
                        setLoading(false);
                    } else {
                        return;
                    }
                } else {
                    console.log("no data");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [isFocused]);

    // FUNCTIONS
    const getEvents = async (eventIdArray) => {
        let events = [];
        for (let i = 0; i < eventIdArray.length; i++) {
            try {
                const eventsQuery = query(
                    child(dbRef, `events/${eventIdArray[i]}`)
                );
                await get(eventsQuery).then((eventSnapshot) => {
                    if (eventSnapshot.exists()) {
                        const data = eventSnapshot.val();
                        events = [...events, data];
                    } else {
                        console.log("no event data");
                    }
                });
            } catch (error) {
                console.log("here", error);
            }
        }
        const today = new Date();
        const filteredEventsPast = events.filter((event) => {
            const eventStartDate = new Date(event.startDate);
            return eventStartDate < today;
        });
        if (filteredEventsPast.length > 0) {
            const sortedEventsPast = filteredEventsPast.sort((a, b) => {
                const startDateA = new Date(a.startDate);
                const startDateB = new Date(b.startDate);
                return startDateA - startDateB;
            });
            setEventList(sortedEventsPast);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            {loading ? (
                <Video
                    source={require("../../../assets/LoadingScreen.mp4")}
                    style={{ flex: 1 }}
                    shouldPlay
                    isLooping
                    resizeMode="cover"
                />
            ) : eventList.length > 0 ? (
                <FlatList
                    data={eventList}
                    renderItem={(itemData) => {
                        return (
                            <PastEvent
                                event={itemData}
                                navigation={navigation}
                                uid={userId}
                            />
                        );
                    }}
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }}
                />
            ) : (
                <View
                    style={{
                        ...globalStyles.container,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ ...globalStyles.heading2, padding: 12 }}>
                        You haven't attended any events yet!
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Create Event", {
                                uid: userId,
                            });
                        }}
                    >
                        <Image
                            source={BeThereConcise}
                            style={{
                                height: 150,
                                width: 150,
                                alignSelf: "center",
                            }}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            ...globalStyles.heading1,
                            fontFamily: "Bukhari Script",
                            padding: 12,
                        }}
                    >
                        Plan something!
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default ViewArchiveScreen;
