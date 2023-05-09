import React, { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getDatabase, ref, child, push, set } from 'firebase/database'

const CreateSubEvents = (props) => {
    const route = useRoute();
    const { eventId } = route.params;

    const [subEvents, setSubEvents] = useState([]);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
    const [selectedSubEventIndex, setSelectedSubEventIndex] = useState(null);
    const [selectedEventType, setSelectedEventType] = useState(null);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

    const navigation = useNavigation()
  
    const handleTimePicker = (eventType, subEventIndex) => {
        setSelectedSubEventIndex(subEventIndex);
        setSelectedEventType(eventType);
        setIsTimePickerVisible(true);
    };
    
    const handleTimeConfirm = (selectedDate) => {
        const formattedTime = selectedDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const newSubEvents = [...subEvents];
        const index = selectedSubEventIndex;
        const eventType = selectedEventType;
        if (eventType === 'start') {
          newSubEvents[index] = { ...newSubEvents[index], startTime: formattedTime };
        } else if (eventType === 'end') {
          newSubEvents[index] = { ...newSubEvents[index], endTime: formattedTime };
        }
        setSubEvents(newSubEvents);
        setIsTimePickerVisible(false);
    };
         
    const handleAddSubEvent = () => {
        const newSubEvents = [...subEvents];
        newSubEvents.push({ name: '', location: '', date: '', startTime: '', endTime: '' });
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

    const handleSubmit = async () => {
        const dbRef = ref(getDatabase());
        const subeventRef = child(dbRef, 'subevents');
        const tagRef = child(dbRef, 'tags');
      
        // Create a new subevent and associate it with a tag
        for (const newSubEvent of subEvents) {
            const { name: subeventName, location: subeventLocation, date: subeventDate, startTime: subeventStartTime, endTime: subeventEndTime } = newSubEvent;
            const newSubEventData = { 
                name: subeventName, 
                location: subeventLocation, 
                date: subeventDate, 
                startTime: subeventStartTime, 
                endTime: subeventEndTime,
                event_id: eventId 
            };

            // Create a new tag with the subevent name
            const newTagData = { name: subeventName };
            const newTagRef = push(tagRef);
            const newTagKey = newTagRef.key;
            await set(newTagRef, newTagData);

            // Create a new subevent and associate it with the new tag
            const newSubEventWithTagData = {
                tag_id: newTagKey,
                ...newSubEventData
            };
            const newSubEventRef = push(subeventRef);
            await set(newSubEventRef, newSubEventWithTagData);

        }
        navigation.navigate("Create Notifications", { eventId: eventId });
    };
      
    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        >
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sub-Events</Text>
                {subEvents.map((subEvent, index) => (
                <View style={styles.section} key={index}>
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
                    <TouchableOpacity style={styles.outlineButton}>
                        <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)}>
                            <Text style={styles.outlineButtonText}>{subEvent.date ? new Date(subEvent.date).toLocaleDateString() : 'Select Date'}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDateTimePickerVisible}
                            mode="date"
                            onConfirm={(selectedDate) => {
                            handleUpdateSubEvent(index, 'date', selectedDate)
                            setIsDateTimePickerVisible(false);
                            }}
                            onCancel={() => setIsDateTimePickerVisible(false)}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.outlineButton} onPress={() => handleTimePicker('start', index)}>
                        <Text style={styles.outlineButtonText}>{subEvent.startTime ? subEvent.startTime : 'Select Start Time'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.outlineButton} onPress={() => handleTimePicker('end', index)}>
                        <Text style={styles.outlineButtonText}>{subEvent.endTime ? subEvent.endTime : 'Select End Time'}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={(time) => handleTimeConfirm(time)}
                        onCancel={() => setIsTimePickerVisible(false)}
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
            <View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Create Sub-Events</Text>
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
    
export default CreateSubEvents;