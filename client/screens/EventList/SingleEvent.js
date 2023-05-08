import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

const SingleEvent = ({ event, navigation }) => {
  // add logic that determines if logged in user id matches host ID; if so, add different styling or add indicator

  // convert ISO date to more legible format
  const formatDate = (date) => {
    let year = date.slice(0, 4);
    let month = date.slice(5, 7);
    let day = date.slice(8, 10);
    month < 10 ? (month = month % 10) : month;
    day < 10 ? (day = day % 10) : day;
    let monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthName[month - 1]} ${day}, ${year}`;
  };

  // 
  //   const handlePress = () => {
  //     navigation.naviate()
  //   }

  return (
    <Pressable
      onPress={() =>
        console.log(`replace with nav to ${event.name} event page`)
      }
    //   onPress={handlePress}
    >
      <View key={event.id} style={styles.item}>
        <Text style={styles.eventHeader}>{event.name}</Text>
        <Text style={styles.eventSubHeader}>{formatDate(event.date)}</Text>
        <Text style={styles.eventSubHeader}>{event.location}</Text>
        <Text style={styles.eventDesc}>{event.description}</Text>
      </View>
    </Pressable>
  );
};

export default SingleEvent;

const styles = StyleSheet.create({
  item: {
    margin: 10,
    borderWidth: 2,
    borderColor: "dodgerblue",
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
