//Nataly was here
import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";

const EventTile = ({ event, uid }) => {

  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('SingleEvent', {event})
      }
    >
      <View key={event.id} style={uid === event.host_id? styles.itemHost : styles.itemGuest}>
        <Text style={styles.eventHeader}>{event.name}</Text>
        <Text style={styles.eventSubHeader}>{event.date}</Text>
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
