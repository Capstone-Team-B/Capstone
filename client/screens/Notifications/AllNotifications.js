import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDatabase, ref, child, get } from 'firebase/database';

const AllNotifications = (params) => {
    const route = useRoute();
    const { eventId } = route.params;
    const [notifications, setNotifications] = useState([]);
    const navigation = useNavigation();
    const dbRef = ref(getDatabase());

    useEffect(() => {
      const notificationsSnapshot = get(child(dbRef, `notifications`));
      console.log(notificationsSnapshot);
      if (!notificationsSnapshot) {
        console.log("no notifications found")
      } else {
        const data = notificationsSnapshot;
        const notificationList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        const filteredNotifications = notificationList.filter((notification) =>
          notification.event_id === eventId
        );
        setNotifications(filteredNotifications);
      }   
    }, [])

    return (
      <View style={styles.container}>
        {notifications.length > 0 
        ? (notifications.map((notification) => (
            <View key={notification.id} style={styles.item}>
              <Text style={styles.text}>Title: {notification.title}</Text>
              <Text style={styles.text}>Body: {notification.body}</Text>
              <Text style={styles.text}>Scheduled Date: {notification.scheduled_date}</Text>
              <Text style={styles.text}>Scheduled Time: {new Date(notification.scheduled_time).toLocaleTimeString()}</Text>
            </View>
          ))) 
        : ( <Text>No notifications found</Text>)}
        <View>
          <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
              <Text style={{ color: 'darkblue', fontWeight: 'bold' }} onPress={() => navigation.navigate("Create Notification")}>
                  Create New Notification
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

export default AllNotifications;


// // useEffect(() => {
// //   const fetchEventData = async () => {
// //     const dbRef = ref(getDatabase());
// //     const currentUser = auth.currentUser;
// //     if (!currentUser) {
// //       navigation.navigate('Login');
// //       return;
// //     }
// //     const currentUserId = currentUser.uid;
// //     console.log('user', currentUserId);

// //     try {
// //       const eventsSnapshot = await get(child(dbRef, `events`));
// //       if (eventsSnapshot.exists()) {
// //         const data = eventsSnapshot.val();
// //         const eventsList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
// //         const filteredEvents = eventsList.filter((event) => event.host_id === currentUserId);
// //         const eventIdList = filteredEvents.map((event) => event.id);
// //         console.log('eventIds', eventIdList);
// //         setEventId(eventIdList);
// //       } else {
// //         console.log('No events available');
// //       }
// //     } catch (error) {
// //       console.log('Error fetching events:', error);
// //     }

// //     try {
// //       const notificationsSnapshot = await get(child(dbRef, `notifications`));
// //       if (notificationsSnapshot.exists()) {
// //         const data = notificationsSnapshot.val();
// //         const notificationList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
// //         const filteredNotifications = notificationList.filter((notification) =>
// //           eventId.includes(notification.event_id)
// //         );
// //         console.log('notis', filteredNotifications);
// //         setNotifications(filteredNotifications);
// //       } else {
// //         console.log('No notifications available');
// //       }
// //     } catch (error) {
// //       console.log('Error fetching notifications:', error);
// //     }
// //   };

// //   fetchEventData();
// // }, []);
