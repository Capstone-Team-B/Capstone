import React, { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getDatabase, ref, child, push, set } from 'firebase/database'
import { format } from 'date-fns'

const CreateNotifications = (props) => {
    const route = useRoute();
    const { eventId } = route.params;

    const [notifications, setNotifications] = useState([]);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
    const [selectedNotificationIndex, setSelectedNotificationIndex] = useState(null);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

    const navigation = useNavigation()

    const showDateTimePicker = (index) => {
        setSelectedNotificationIndex(index);
        setIsDateTimePickerVisible(true);
    };
      
    const handleAddNotification = () => {
        const newNotifications = [...notifications];
        newNotifications.push({ title: '', body: '', scheduled_date: '', scheduled_time: '' });
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

    const handleSubmit = async () => {
        const dbRef = ref(getDatabase());
        const notificationRef = child(dbRef, 'notifications');
        const tagRef = child(dbRef, 'tags');
      
        // Create a new subevent and associate it with a tag
        for (const notification of notifications) {
            const { title: notificationTitle, body: notificationBody, scheduled_date: notificationDate, scheduled_time: notificationTime } = notification;
            const newNotificationData = {
                title: notificationTitle, 
                body: notificationBody, 
                scheduled_date: notificationDate,
                scheduled_time: notificationTime,
                event_id: eventId
            }

            // Create a new tag with the subevent name
            const newTagData = { name: notificationTitle };
            const newTagRef = push(tagRef);
            const newTagKey = newTagRef.key;
            await set(newTagRef, newTagData);

            // Create a new subevent and associate it with the new tag
            const newNotificationWithTagData = {
                tag_id: newTagKey,
                ...newNotificationData
            };
            const newNotificationRef = push(notificationRef);
            await set(newNotificationRef, newNotificationWithTagData);
        }
        navigation.navigate("Create Guest List", { eventId: eventId });
    };
      
    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        >
        <ScrollView style={styles.container}>
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {notifications.map((notification, index) => (
                <View style={styles.section} key={index}>
                <View style={styles.section}>
                <TextInput
                    style={styles.input}
                    placeholder="RSVP deadline, Reminder to book flights, etc."
                    value={notification.type}
                    onChangeText={(value) => handleUpdateNotification(index, 'type', value)}
                />
                <TouchableOpacity style={styles.outlineButton} onPress={() => showDateTimePicker(index)}>
                <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)}>
                    <Text style={styles.outlineButtonText}>
                    {notification.scheduled_date ? new Date(notification.scheduled_date).toLocaleDateString() : 'Select Notification Date'}
                    </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDateTimePickerVisible}
                    mode="date"
                    onConfirm={(selectedDate) => {
                    handleUpdateNotification(index, 'scheduled_date', selectedDate)
                    setIsDateTimePickerVisible(false);
                    }}
                    onCancel={() => setIsDateTimePickerVisible(false)}
                />
                </TouchableOpacity>
                    <TouchableOpacity style={styles.outlineButton} onPress={() => setIsTimePickerVisible(true)}>
                        <Text style={styles.outlineButtonText}>
                        {notification.scheduled_time ? format(notification.scheduled_time, 'hh:mm a') : 'Select Notification Time'}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={(selectedTime) => {
                            handleUpdateNotification(index, 'scheduled_time', selectedTime)
                            setIsTimePickerVisible(false)
                        }}
                        onCancel={() => setIsTimePickerVisible(false)}
                    />
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNotification(index)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                </View>
                </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={handleAddNotification}>
                <Text style={styles.addButtonText}>Add Notification</Text>
            </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Create Notifications</Text>
                </TouchableOpacity>
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
    
export default CreateNotifications;