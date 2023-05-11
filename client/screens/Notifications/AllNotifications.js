import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Alert, ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, child, get } from 'firebase/database';

const AllNotifications = (params) => {
    const [event, setEvent] = useState(params.route.params.event);
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
          notification.event_id === event.id
        );
        setNotifications(filteredNotifications);
      }   
    }, [])

    return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      > 
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          {notifications.length > 0 
          ? (notifications.map((notification) => (
              <View key={notification.id} style={styles.item}>
                <Text style={styles.input}>Title: {notification.title}</Text>
                <Text style={styles.input}>Body: {notification.body}</Text>
                <Text style={styles.input}>Scheduled Date: {notification.scheduled_date}</Text>
                <Text style={styles.input}>Scheduled Time: {new Date(notification.scheduled_time).toLocaleTimeString()}</Text>
              </View>
            ))) 
          : ( <Text>No notifications found</Text>)}
          <View>
            <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    navigation.navigate('Create Notification', { event: event })
                  }
                >
                <Text style={styles.addButtonText}>Create New Notification</Text>
              </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
  ); 
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
  },
  section: {
      marginBottom: 20,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
  },
  addButton: {
      backgroundColor: '#007bff',
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
  },
  addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
  deleteButton: {
      backgroundColor: 'white',
      borderColor: '#dc3545',
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
  },
  deleteButtonText: {
      color: '#dc3545',
      fontSize: 14,
      fontWeight: 'bold',
  },
  outlineButton: {
      backgroundColor: 'white',
      borderColor: '#007bff',
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
  },
  outlineButtonText: {
      color: '#007bff',
      fontSize: 14,
      fontWeight: 'bold',
  },
  submitButton: {
      backgroundColor: '#2E8B57',
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
  },
  submitButtonText: {
      color: '#fff',
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
