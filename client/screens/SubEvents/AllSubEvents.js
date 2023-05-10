import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDatabase, ref, child, get } from 'firebase/database';

const AllSubEvents = (params) => {
    const route = useRoute();
    const { eventId } = route.params;
    const [subEvent, setSubEvent] = useState([]);
    const navigation = useNavigation();
    const dbRef = ref(getDatabase());

    useEffect(() => {
      const subEventSnapshot = get(child(dbRef, `subevents`));
      console.log(subEventSnapshot);
      if (!subEventSnapshot) {
        console.log("no subevents found")
      } else {
        const data = subEventSnapshot;
        const subEventList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        const filteredSubEvent = subEventList.filter((subEvent) =>
          subEvent.event_id === eventId
        );
        setSubEvent(filteredSubEvent);
      }   
    }, [])

    return (
      <View style={styles.container}>
        {subEvent.length > 0 
        ? (subEvent.map((subEvent) => (
            <View key={subEvent.id} style={styles.item}>
              <Text style={styles.text}>Title: {subEvent.title}</Text>
              <Text style={styles.text}>Body: {subEvent.body}</Text>
              <Text style={styles.text}>Scheduled Date: {subEvent.scheduled_date}</Text>
              <Text style={styles.text}>Scheduled Time: {new Date(subEvent.scheduled_time).toLocaleTimeString()}</Text>
            </View>
          ))) 
        : ( <Text>No subevents found</Text>)}
        <View>
          <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
              <Text style={{ color: 'darkblue', fontWeight: 'bold' }} onPress={() => navigation.navigate("Create Sub Event")}>
                  Create New Sub Event
              </Text>
          </Text>
        </View>
      </View>
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AllSubEvents;