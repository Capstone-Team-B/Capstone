//Nataly was here
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getDatabase, ref, child, get } from "firebase/database";
import globalStyles from "../../utils/globalStyles";

const SingleEvent = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
    // console.log(event);

    useEffect(() => {
        setEvent(params.route.params.event);
    }, [params.route.params.event]);

    const navigation = useNavigation();

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading1}> {event.name}</Text>
      <Text style={globalStyles.heading2}> {event.description}</Text>
      <Text style={globalStyles.heading2}>
        {new Date(event.date).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      <Text style={globalStyles.heading2}> {event.location}</Text>
      <Text style={globalStyles.paragraph}>
        {" "}
        {event.starttime} & {event.endtime}
      </Text>
      <Text style={globalStyles.paragraph}> {event.description}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("GuestScreen", { eventId: event.id })
        }
      >
        <Text>Get all guest</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MessageboardScreen", {
            eventId: event.id,
            name: event.name,
          })
        }
      >
        <Text>Event Messageboard</Text>
      </TouchableOpacity>
      <View style={styles.tileContainer}>
        <TouchableOpacity
          style={styles.tile}
          onPress={() =>
            navigation.navigate("GuestProfileScreen", { eventId: event.id })
          }
        >
          <Text>My Guest Profile</Text>
        </TouchableOpacity>
        {/* need to add logic to only show if user is host */}
        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate("Edit Event", { event: event })}
        >
          <Text>Edit Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate("Guest", { eventId: event.id })}
        >
          <Text>Guest List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate("Maps", { eventId: event.id })}
        >
          <Text>Maps and Events</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SingleEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  tileContainer:{
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tile: {
    height: 150,
    width: 150,
    padding: 10,
    margin: 10,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10
  },
});
