import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, child, set, push } from 'firebase/database';

const CreateEventForm = () => {
    const [weddingName, setWeddingName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedEventType, setSelectedEventType] = useState('');
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

    const navigation = useNavigation();

    const handleTimePicker = (eventType) => {
        setIsTimePickerVisible(true);
        setSelectedEventType(eventType);
    };
        
    const handleTimeConfirm = (selectedDate) => {
        const formattedTime = selectedDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        if (selectedEventType === 'start') {
        setStartTime(formattedTime);
        } else if (selectedEventType === 'end') {
        setEndTime(formattedTime);
        }
        setIsTimePickerVisible(false);
    };
        
    const showDateTimePicker = () => {
        setIsDateTimePickerVisible(true);
    };
        
    const handleSubmit = async () => {
        try {
            const dbRef = ref(getDatabase());
            const currentUser = auth.currentUser;
            if (!currentUser) {
                navigation.navigate("Login");
                return;
            }
            const currentUserId = currentUser.uid;
            const eventRef = child(dbRef, "events");
        
            const newEventRef = push(eventRef);
            const newEvent = {
                name: weddingName,
                location: location,
                date: date,
                startTime: startTime,
                endTime: endTime,
                host_id: currentUserId,
            };
            await set(newEventRef, newEvent);
            const eventId = newEventRef.key;

            navigation.navigate("Create Sub Events", { eventId: eventId });
          
        } catch (error) {
            console.log(error);
        }
    };
       
    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        >
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
                <TouchableOpacity style={styles.outlineButton} onPress={() => showDateTimePicker()}>
                    <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)}>
                        <Text style={styles.outlineButtonText}>{date ? date.toLocaleDateString() : 'Select Date'}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                    isVisible={isDateTimePickerVisible}
                    mode="date"
                    onConfirm={(selectedDate) => {
                        setDate(selectedDate)
                        setIsDateTimePickerVisible(false);
                    }}
                    onCancel={() => setIsDateTimePickerVisible(false)}
                    />
                </TouchableOpacity>
                   <TouchableOpacity style={styles.outlineButton} onPress={() => handleTimePicker('start')}>
                    <Text style={styles.outlineButtonText}>{startTime ? startTime : 'Select Start Time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outlineButton} onPress={() => handleTimePicker('end')}>
                    <Text style={styles.outlineButtonText}>{endTime ? endTime : 'Select End Time'}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={(time) => handleTimeConfirm(time)}
                    onCancel={() => setIsTimePickerVisible(false)}
                />
            </View>
            <View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Create Event</Text>
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
    
export default CreateEventForm;