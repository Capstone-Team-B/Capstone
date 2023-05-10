//Nataly was here
import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";

const EventTile = ({ event, uid }) => {
  // add logic that determines if logged in user id matches host ID; if so, add different styling or add indicator

  // convert ISO date to more legible format
  // const formatDate = (date) => {
  //   let year = date.slice(0, 4);
  //   let month = date.slice(5, 7);
  //   let day = date.slice(8, 10);
  //   month < 10 ? (month = month % 10) : month;
  //   day < 10 ? (day = day % 10) : day;
  //   let monthName = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];
  //   return `${monthName[month - 1]} ${day}, ${year}`;
  // };

  // 
  //   const handlePress = () => {
  //     navigation.naviate()
  //   }
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('SingleEvent', {event})
      }
    >
      <View key={event.id} style={uid === event.host_id? styles.itemHost : styles.itemGuest}>
        <Text style={styles.eventHeader}>{event.name}</Text>
        {/* <Text style={styles.eventSubHeader}>{formatDate(event.date)}</Text> */}
        <Text style={styles.eventSubHeader}>{event.location}</Text>
        <Text style={styles.eventDesc}>{event.description}</Text>
      </View>
    </Pressable>
  );
};

export default EventTile;

const styles = StyleSheet.create({
  itemGuest: {
    margin: 10,
    borderWidth: 2,
    borderColor: "dodgerblue",
    padding: 10,
  },
  itemHost: {
    margin: 10,
    borderWidth: 2,
    borderColor: "orchid",
    backgroundColor: "plum",
    padding: 10,
  },
  eventHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventSubHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDesc: {
    fontSize: 14,
  },
});
