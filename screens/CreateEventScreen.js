import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const CreateEventForm = () => {
    const [weddingName, setWeddingName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [subEvents, setSubEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [guestList, setGuestList] = useState([]);

    const handleAddSubEvent = () => {
        const newSubEvents = [...subEvents];
        newSubEvents.push({ name: '', location: '', startTime: '', endTime: '' });
        setSubEvents(newSubEvents);
    };

    const handleDeleteSubEvent = (index) => {
        const newSubEvents = [...subEvents];
        newSubEvents.splice(index, 1);
        setSubEvents(newSubEvents);
    };

    const handleUpdateSubEvent = (index, field, value) => {
        const newSubEvents = [...subEvents];
        newSubEvents[index][field] = value;
        setSubEvents(newSubEvents);
    };

    const handleAddNotification = () => {
        const newNotifications = [...notifications];
        newNotifications.push({ type: '', time: '' });
        setNotifications(newNotifications);
    };

    const handleDeleteNotification = (index) => {
        const newNotifications = [...notifications];
        newNotifications.splice(index, 1);
        setNotifications(newNotifications);
    };

    const handleUpdateNotification = (index, field, value) => {
        const newNotifications = [...notifications];
        newNotifications[index][field] = value;
        setNotifications(newNotifications);
    };

    const handleAddGuest = (email, name) => {
        const newGuestList = [...guestList];
        newGuestList.push({ email, name });
        setGuestList(newGuestList);
    };

    const handleDeleteGuest = (index) => {
        const newGuestList = [...guestList];
        newGuestList.splice(index, 1);
        setGuestList(newGuestList);
    };

    return (
        <ScrollView style={styles.container}>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wedding Details</Text>
            <TextInput
            style={styles.input}
            placeholder="Wedding Name"
            value={weddingName}
            onChangeText={setWeddingName}
            />
            <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            />
            <TextInput
            style={styles.input}
            placeholder="Date"
            value={date}
            onChangeText={setDate}
            />
            <TextInput
            style={styles.input}
            placeholder="Start Time"
            value={startTime}
            onChangeText={setStartTime}
            />
            <TextInput
            style={styles.input}
            placeholder="End Time"
            value={endTime}
            onChangeText={setEndTime}
            />
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sub-Events</Text>
            {subEvents.map((subEvent, index) => (
            <View style={styles.subEventContainer} key={index}>
                <TextInput
                style={styles.input}
                placeholder="Name"
                value={subEvent.name}
                onChangeText={(value) => handleUpdateSubEvent(index, 'name', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={subEvent.location}
                    onChangeText={(value) =>
                    handleUpdateSubEvent(index, 'location', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Start Time"
                    value={subEvent.startTime}
                    onChangeText={(value) =>
                    handleUpdateSubEvent(index, 'startTime', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="End Time"
                    value={subEvent.endTime}
                    onChangeText={(value) =>
                    handleUpdateSubEvent(index, 'endTime', value)}
                />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSubEvent(index)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddSubEvent}>
                <Text style={styles.addButtonText}>Add Sub-Event</Text>
            </TouchableOpacity>
            </View>
        
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {notifications.map((notification, index) => (
                <View style={styles.notificationContainer} key={index}>
                <TextInput
                    style={styles.input}
                    placeholder="Type (RSVP Deadline, etc.)"
                    value={notification.type}
                    onChangeText={(value) =>
                    handleUpdateNotification(index, 'type', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Time (in days/hours/minutes)"
                    value={notification.time}
                    onChangeText={(value) =>
                    handleUpdateNotification(index, 'time', value)}
                />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteNotification(index)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddNotification}>
                <Text style={styles.addButtonText}>Add Notification</Text>
            </TouchableOpacity>
            </View>
        
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guest List</Text>
            <View style={styles.guestListContainer}>
                {guestList.map((guest, index) => (
                <View style={styles.guestContainer} key={index}>
                    <Text>{guest.email}</Text>
                    <Text>{guest.name}</Text>
                    <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteGuest(index)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                ))}
            </View>
            <TouchableOpacity style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Upload CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddGuest}>
                <Text style={styles.addButtonText}>Add Guest</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
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
    notificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    guestListContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    guestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
});
    
export default CreateEventForm;