//ENH was here formating autosaved
// I keep getting an error message when I it directs to the upcoming events that the list needs a key passed in.
//// ERROR  Warning: Each child in a list should have a unique "key" prop.
//// Check the render method of `VirtualizedList`. See https://reactjs.org/link/warning-keys for more information.
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

const EventListScreen = (props) => {
    const { uid } = props.route.params;
    const [eventList, setEventList] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    const userEventIds = data.userEvents;
                    getEvents(userEventIds);
                } else {
                    console.log("no event data");
                }
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }, []);

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
                        return item.id;
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
