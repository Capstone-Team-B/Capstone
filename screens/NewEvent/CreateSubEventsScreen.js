import React, { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native'
import { getDatabase, ref, child, get, set } from 'firebase/database'

const CreateSubEvents = ({ event }) => {
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
    
    const handleTimeConfirm = (selectedDate, eventType) => {

    };
    
    const showDateTimePicker = (subEventIndex) => {
        setSelectedSubEventIndex(subEventIndex);
        setIsDateTimePickerVisible(true);
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
        for (const subEvent of subEvents) {
            const { name: subeventName, location: subeventLocation, date: subeventDate, startTime: subeventStartTime, endTime: subeventEndTime } = subEvent;

            // Create a new tag with the subevent name
            const newTagRef = push(tagRef);
            const newTagKey = newTagRef.key;
            await set(newTagRef, { name: subeventName });

            // Create a new subevent and associate it with the new tag
            const newSubeventRef = push(subeventRef);
            const newSubeventKey = newSubeventRef.key;
            await set(newSubeventRef, {
                event_id: eventId,
                name: subeventName,
                location: subeventLocation,
                date: subeventDate,
                start_time: subeventStartTime,
                end_time: subeventEndTime,
                tag_id: newTagKey
            });
        }
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
                    <TouchableOpacity style={styles.outlineButton} onPress={() => showDateTimePicker(index)}>
                        <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)}>
                            <Text style={styles.outlineButtonText}>{date ? date.toLocaleDateString() : 'Select Date'}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                        isVisible={isDateTimePickerVisible}
                        mode="date"
                        onConfirm={(selectedDate) => {
                            handleUpdateSubEvent(index, 'startTime', selectedDate)
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