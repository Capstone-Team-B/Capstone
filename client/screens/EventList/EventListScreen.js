import { StyleSheet, View, Text, SafeAreaView, FlatList } from "react-native";
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
        setLoading(false);
    }, [isFocused]);

    const navigation = useNavigation();

    return (
        <SafeAreaView style={globalStyles.container}>
            {loading ? (
                <Text>Loading your events...</Text>
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
                <>
                    <Text>No events coming up</Text>
                    <Text>Plan something!</Text>
                </>
            )}
        </SafeAreaView>
    );
};

export default EventListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
