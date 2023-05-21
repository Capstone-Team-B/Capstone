// REACT IMPORTS
import {
    View,
    Text,
    SafeAreaView,
    Image,
    FlatList,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
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
    equalTo
} from "firebase/database";
import { useNavigation, useIsFocused } from "@react-navigation/native";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
import EventTile from "./EventTile";
import { auth } from "../../../firebase";
const BeThereConcise = require("../../../assets/BeThereConcise.png");

const EventListScreen = (props) => {
    // COMPONENT VARIABLES
    const isFocused = useIsFocused();
    const dbRef = ref(getDatabase());
    const navigation = useNavigation();

    // USESTATE
    const [eventList, setEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    
    // USEEFFECT
    useEffect(() => {
        const getUserId = async () => {
            const currentUserId = auth.currentUser.uid
            const dbRef = ref(getDatabase());
            const usersQuery = query(
                child(dbRef, 'users'),
                orderByChild('auth_id'),
                equalTo(currentUserId)
            )
            const snapshot = await get (usersQuery);
    
            if (snapshot.exists()) {
                const data = Object.keys(snapshot.val());
                setUserId(data[0])
                const checkUserEvents = child(dbRef, `users/${data[0]}/userEvents`)
                if (!checkUserEvents) {
                    return setLoading(false)
                }
                const eventIdsQuery = query(
                    child(dbRef, `users/${data[0]}`),
                    orderByChild("userEvents")
                    );
                    try {
                        get(eventIdsQuery).then((eventSnapshot) => {
                            if (eventSnapshot.exists()) {
                                const data = eventSnapshot.val();
                                if(data.userEvents){
                                    const objVal = Object.values(data.userEvents)
                                    const userEventIds = objVal.map((event) => event.event_id)
                                    getEvents(userEventIds);
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
            }
        }

        getUserId()
        setLoading(false)
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
        setEventList(events);
        setLoading(false);
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
                            <EventTile
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
                        No events coming up
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Create Event", { uid: userId });
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

export default EventListScreen;
