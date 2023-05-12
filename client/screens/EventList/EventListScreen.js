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
  console.log("uid in EventListScreen -->", uid);
  const [guestList, setGuestList] = useState(null);
  const [eventIds, setEventIds] = useState([]);
  const [eventList, setEventList] = useState([]);
  const dbRef = ref(getDatabase());
  useEffect(() => {

    const eventQuery = query(
      child(dbRef, `events`),
      orderByChild('id')
    );
  
    get(eventQuery).then((eventSnapshot) => {
      if (eventSnapshot.exists()) {
        // console.log(eventSnapshot.val());
        const data = eventSnapshot.val();
        const eventList = Object.keys(data).map((key) => ({...data[key] }));
        let events = [];
        eventList.map((event)=>{
          if(event.host_id == uid || event.guests?.some(e=> e == uid)){
            console.log("Is a host/guest from event "+ event.description)
            events.push(event);
          }
        });
        setEventList(events);
      }
    })
    //TODO: Delete all this
    // const dbRef = ref(getDatabase());
    // get(
    //   query(child(dbRef, "guestlist"), orderByChild("guest_id"), equalTo(uid))
    // )
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       const events = Object.values(snapshot.val()).map(
    //         (event) => event.event_id
    //       );
    //       setGuestList(snapshot.val());
    //       setEventIds(events);
    //     } else {
    //       console.log("No data available");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // if (eventIds.length) {
    //   let events = [];
    //   for (let i = 0; i < eventIds.length; i++) {
    //     get(query(child(dbRef, `events/${eventIds[i]}`))).then((snapshot) => {
    //       if (snapshot.exists()) {
    //         events.push(snapshot.val());
    //       }
    //     });
    //   }
    //   setEventList(events);
    // }
    // console.log("guestlist -->", guestList);

    
  }, []);

  const navigation = useNavigation();
  return (
    <SafeAreaView style={globalStyles.container}>
      {loading ? (
        <Text>Loading your events...</Text>
      ) : eventList.length ? (
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
