//Nataly was here
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

const EventListScreen = (props) => {
  const { uid } = props.route.params;
  // console.log("uid in EventListScreen -->", uid);
  const [guestList, setGuestList] = useState(null);
  const [eventIds, setEventIds] = useState([]);
  const [eventList, setEventList] = useState([]);
  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(query(child(dbRef, "guestlist"), orderByChild("guest_id"), equalTo(uid)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const events = Object.values(snapshot.val()).map(
            (event) => event.event_id
          );
          setGuestList(snapshot.val());
          setEventIds(events);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (eventIds.length) {
      let events = [];
      for (let i = 0; i < eventIds.length; i++) {
        get(query(child(dbRef, `events/${eventIds[i]}`))).then((snapshot) => {
          if (snapshot.exists()) {
            events.push(snapshot.val());
          }
        });
      }
      setEventList(events);
    }
    console.log("guestlist -->", guestList)
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {guestList ? (
        <FlatList
          data={eventList}
          renderItem={(itemData) => {
            return <EventTile event={itemData.item} navigation={navigation} uid={uid}/>;
          }}
          keyExtractor={(item, index) => {
            return item.id;
          }}
        />
      ) : (
        <Text>No events</Text>
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

snapshot = [
  { event_id: 1, guest_id: 2, role: "Host", tag_id: 1 },
  { event_id: 2, guest_id: 2, role: "Host", tag_id: 2 },
];
