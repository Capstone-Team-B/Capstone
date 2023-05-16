import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Image,
    FlatList,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import EventTile from "./EventTile";
import {
    getDatabase,
    ref,
    child,
    get,
    query,
    orderByChild,
    equalTo,
} from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../utils/globalStyles";
import { useIsFocused } from "@react-navigation/native";
import { Video } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";
const BeThereConcise = require("../../../assets/BeThereConcise.png");

const EventListScreen = (props) => {
    const { uid } = props.route.params;
    const [eventList, setEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const dbRef = ref(getDatabase());

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
                console.log(error);
            }
        }
        setEventList(events);
        setLoading(false);
    };

    useEffect(() => {
        const eventIdsQuery = query(
            child(dbRef, `users/${uid}`),
            orderByChild("userEvents")
        );
        try {
            get(eventIdsQuery).then((eventSnapshot) => {
                if (eventSnapshot.exists()) {
                    const data = eventSnapshot.val();
                    const userEventIds = Object.values(data.userEvents);
                    getEvents(userEventIds);
                } else {
                    console.log("no event data");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [isFocused]);

    const navigation = useNavigation();

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
                                event={itemData.item}
                                navigation={navigation}
                                uid={uid}
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
                            navigation.navigate("Create Event", { uid: uid });
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
