import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { auth } from '../../../firebase';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, child, set, push } from 'firebase/database';

const CreateNewUserScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [dietary, setDietary] = useState('');
  const [accomodations, setAccomodations] = useState('');
  const [password, setPassword] = useState("")
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if(!firstName || !lastName || !email)
  }


  return (
    <View>
      <Text>CreateNewUserScreen</Text>
    </View>
  );
};

export default CreateNewUserScreen;
