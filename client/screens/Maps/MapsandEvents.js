//Nataly was here
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    query,
    orderByChild,
    equalTo,
    orderByValue,
} from "firebase/database";
import MapView, { Marker } from "react-native-maps";
import { removeEmpty } from "../../utils/ArrayUtils";
//import MapView from 'react-native-maps'

const MapEventScreen = (params) => {
    const [eventId, setEventId] = useState(params.route.params.eventId);
    const [subevents, setSubEvents] = useState([]);
    const [mapRegion, setmapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const dbRef = ref(getDatabase());

  useEffect(() => {
    get(
      query(
        child(dbRef, "subevents"),
        orderByChild("event_id"),
        equalTo(params.route.params.eventId)
      )
    )
      .then(async(snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataFiltered = removeEmpty(data)
          for (let index = 0; index < dataFiltered.length; index++) {
            const element = dataFiltered[index];
            const latlon = await fetch(`https://geocode.maps.co/search?q={${element.location}}`).then(async data=>data.json())
            console.log('each',latlon)
            element.latitude = latlon[0].lat
            element.longitude = latlon[0].lon
          }
          console.log('filtered', dataFiltered)
          setSubEvents(dataFiltered);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.route.params.eventId]);
  return (
    <View style={styles.container}>
      {subevents.length > 0 ? (
        <MapView
          style={{ alignSelf: "stretch", height: "100%" }}
          region={{
            latitude: subevents[0].latitude,
            longitude: subevents[0].longitude,
          }}
        >
          {subevents.map((marker, index) => (
            <Marker
              key={index}
              title={marker.location}
              description={marker.nameLocation}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            />
          ))}
        </MapView>
      ) : (
        <Text>Not events</Text>
      )}
      <Text> Maps and Events {eventId}</Text>
    </View>
  );
};

export default MapEventScreen;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: "stretch",
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
        backgroundColor: "transparent",
    },
});
