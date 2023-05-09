//Nataly was here 
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import SingleEvent from "./SingleEvent";
import { getDatabase, ref, child, get } from "firebase/database";

const EventList = ({navigation}) => {
  const dummyEvents = [
    {
      id: 1,
      name: "John & Jane's Wedding",
      location: "New York City",
      date: "2023-09-15T14:30:00.000Z",
      description: "Join us for our fall wedding",
    },
    {
      id: 2,
      name: "Ahmed & Maria's Wedding",
      location: "Los Angeles",
      date: "2023-10-20T16:00:00.000Z",
      description: "Celebrate our love at our autumn wedding",
    },
    {
      id: 3,
      name: "David & Juan's Wedding",
      location: "Chicago",
      date: "2024-01-05T17:30:00.000Z",
      description: "Join us as we tie the knot in the new year",
    },
    {
      id: 4,
      name: "Lei & Rachel's Wedding",
      location: "Miami",
      date: "2024-02-14T18:00:00.000Z",
      description: "Come celebrate our love on Valentine's Day",
    },
    {
      id: 5,
      name: "Fatima & Emily's Wedding",
      location: "San Francisco",
      date: "2024-04-01T15:00:00.000Z",
      description: "Join us for our spring wedding in the city by the bay",
    },
    {
      id: 6,
      name: "Daniel & Kunal's Wedding",
      location: "Austin",
      date: "2024-05-12T17:00:00.000Z",
      description: "Join us as we say 'I do' in the heart of Texas",
    },
    {
      id: 7,
      name: "Mimiko & Sophia's Wedding",
      location: "Seattle",
      date: "2024-07-06T16:30:00.000Z",
      description: "Join us for our summer wedding by the sea",
    },
    {
      id: 8,
      name: "Marco & Ava's Wedding",
      location: "Boston",
      date: "2024-09-21T14:00:00.000Z",
      description: "Join us as we begin our marriage journey",
    },
    {
      id: 9,
      name: "Ryan & Eric's Wedding",
      location: "Nashville",
      date: "2024-10-19T16:30:00.000Z",
      description: "Join us for our autumn wedding in Music City",
    },
    {
      id: 10,
      name: "Jacob & Mia's Wedding",
      location: "Denver",
      date: "2024-12-07T15:00:00.000Z",
      description: "Join us as we celebrate our love in the Mile High City",
    },
  ];
  const [events, setEvents] = useState([]);

  // all events query from firebase is working, but dummy data is currently being rendered to test formatting + scrolling functionality
  // add logic that queries all events and returns events for which logged in user ID is included in guest list || host ID

    const dbRef = ref(getDatabase());
    get(child(dbRef, "events"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const eventList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setEvents(eventList);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        renderItem={(itemData) => {
          return <SingleEvent event={itemData.item} navigation={navigation}/>;
        }}
        keyExtractor={(item, index) => {
          return item.id;
        }}
      />
    </SafeAreaView>
  );
};

export default EventList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
