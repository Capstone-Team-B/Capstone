// REACT IMPORTS
import React, { useState, useEffect, useCallback } from "react";
import {
    KeyboardAvoidingView,
    StatusBar,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Ionicons from "react-native-vector-icons/Ionicons";
// EXPO IMPORTS
import * as Contacts from "expo-contacts";
// FIREBASE IMPORTS
import {
    getDatabase,
    ref,
    child,
    set,
    push,
    query,
    get,
    orderByChild,
    equalTo,
    update,
} from "firebase/database";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";

const ImportContacts = (params) => {
    // COMPONENT VARIABLES
    const navigation = useNavigation();

    // PROPS & PARAMS
    const uid = params.route.params.uid;
    const eventId = event.event_id;

    // STATE
    const [event, setEvent] = useState(params.route.params.event);
    const [error, setError] = useState(undefined);
    const [contacts, setContacts] = useState(undefined);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [checks, setChecks] = useState([]);

    // USEEFFECTS
    useEffect(() => {
        if (!contacts) {
            return;
        }
        if (toggleCheckBox) {
            setSelectedContacts(contacts);
            setChecks(contacts.map(() => true));
        } else {
            setChecks(contacts.map(() => false));
        }
    }, [toggleCheckBox, contacts, setSelectedContacts, setChecks]);

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Contacts.requestPermissionsAsync();
                if (status === "granted") {
                    const { data } = await Contacts.getContactsAsync({
                        fields: [
                            Contacts.Fields.Emails,
                            Contacts.Fields.FirstName,
                            Contacts.Fields.LastName,
                            Contacts.Fields.PhoneNumbers,
                        ],
                    });

                    if (data.length > 0) {
                        setContacts(data);
                        setChecks(
                            Array.from({ length: data.length }, () => false)
                        );
                    } else {
                        setError("No contacts found");
                    }
                } else {
                    setError("Permission to access contacts denied.");
                }
            } catch (error) {
                console.error(error);
                setError("An error occurred while fetching contacts.");
            }
        })();
    }, []);

    // FUNCTIONS
    const handleSelectAll = useCallback(() => {
        setToggleCheckBox((previous) => !previous);

        if (!toggleCheckBox) {
            setSelectedContacts([...contacts]);
            setChecks(contacts.map(() => true));
        } else {
            setSelectedContacts([]);
            setChecks(contacts.map(() => false));
        }
    }, [toggleCheckBox, contacts, setSelectedContacts, setChecks]);

    const onCheck = useCallback(
        (index) => {
            let previous = [...checks];
            previous[index] = !previous[index];
            setChecks(previous);

            let newSelectedContacts = [];
            for (let i = 0; i < previous.length; i++) {
                if (previous[i]) {
                    newSelectedContacts.push(contacts[i]);
                }
            }
            setSelectedContacts(newSelectedContacts);
        },
        [checks, contacts, setSelectedContacts, setChecks]
    );

    const handleSubmit = async () => {
        const dbRef = ref(getDatabase());
        const usersRef = child(dbRef, `users`);
        const guestListRef = child(dbRef, `events/${eventId}/guestList`);

        for (const guest of selectedContacts) {
            const {
                email: guestEmail,
                firstName: guestFirstname,
                lastName: guestLastname,
                phoneNumbers: guestPhone,
            } = guest;

            const newGuestListData = {
                firstName: guestFirstname,
            };

            if (guestLastname) {
                newGuestListData.lastName = guestLastname;
            }

            if (guestEmail) {
                newGuestListData.email = guestEmail;
            }

            let phoneNumber;

            if (guestPhone) {
                const mobileNumber = guestPhone.find(
                    (item) => item.label === "mobile"
                );
                if (mobileNumber) {
                    phoneNumber = mobileNumber.number;
                } else {
                    const homeNumber = guestPhone.find(
                        (item) => item.label === "home"
                    );
                    if (homeNumber) {
                        phoneNumber = homeNumber.number;
                    } else {
                        const workNumber = guestPhone.find(
                            (item) => item.label === "work"
                        );
                        if (workNumber) {
                            phoneNumber = workNumber.number;
                        }
                    }
                }
            }

            if (phoneNumber) {
                const formattedPhone = phoneNumber.replace(/\D/g, "");
                if (formattedPhone.length !== 10) {
                    Alert.alert(
                        `Invalid phone number for ${guest.firstName} ${guest.lastName}`
                    );
                }
                newGuestListData.phoneNumber = formattedPhone.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                );
                try {
                    const usersQuery = query(
                        child(dbRef, "users"),
                        orderByChild("phoneNumber"),
                        equalTo(
                            formattedPhone.replace(
                                /(\d{3})(\d{3})(\d{4})/,
                                "($1) $2-$3"
                            )
                        )
                    );
                    const snapshot = await get(usersQuery);

                    if (snapshot.exists()) {
                        const userData = Object.values(snapshot.val());
                        newGuestListData.user_id = userData[0].user_id;

                        const newEventGuestsRef = child(
                            guestListRef,
                            userData[0].user_id
                        );
                        await update(newEventGuestsRef, {
                            guest_id: userData[0].user_id,
                            attending: false,
                        });

                        const existingUserEventRef = child(
                            dbRef,
                            `users/${userData[0].user_id}/userEvents`
                        );
                        const updatedUserEvent = {
                            event_id: event.event_id,
                            attending: false,
                        };
                        await push(existingUserEventRef, updatedUserEvent);
                    } else {
                        const newGuestListRef = push(usersRef);
                        const newGuestListKey = newGuestListRef.key;
                        newGuestListData.user_id = newGuestListKey;

                        newGuestListData.userEvents = {
                            [event.event_id]: {
                                event_id: event.event_id,
                                attending: false,
                            },
                        };

                        await set(newGuestListRef, newGuestListData);

                        const newEventGuestsRef = child(
                            guestListRef,
                            newGuestListKey
                        );
                        await update(newEventGuestsRef, {
                            guest_id: newGuestListKey,
                            attending: false,
                        });
                    }
                    // await initiateSMS(guestPhone.replace(/\D/g, ""));
                } catch (error) {
                    console.log("Error:", error);
                    // Alert.alert("Something went wrong, please try again.");
                    return;
                }
            } else {
                Alert.alert(
                    "Please only import contacts with a valid phone number."
                );
                return;
            }
        }
        navigation.navigate("SingleEvent", { uid: uid, event: event });
    };

    const getPhoneNumberData = (data, property) => {
        if (data) {
            let phoneNumber = data.find((item) => item.label === "mobile");
            if (!phoneNumber) {
                phoneNumber = data.find((item) => item.label === "home");
            }
            if (!phoneNumber) {
                phoneNumber = data[0];
            }
            return (
                <View>
                    <Text>
                        {phoneNumber.label}: {phoneNumber[property]}
                    </Text>
                </View>
            );
        }
    };

    const getEmailData = (data, property, label) => {
        if (data) {
            return data.map((data, index) => {
                return (
                    <View key={index}>
                        <Text>
                            {label}: {data[property]}
                        </Text>
                    </View>
                );
            });
        }
    };

    const getContactRows = () => {
        if (contacts !== undefined) {
            return contacts.map((contact, index) => {
                return (
                    <View key={index}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                            }}
                        >
                            <BouncyCheckbox
                                isChecked={checks[index]}
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) =>
                                    setToggleCheckBox(newValue)
                                }
                                onPress={() => onCheck(index)}
                                disableBuiltInState={true}
                            />
                            <Text style={{ flexWrap: "wrap" }}>
                                name: {contact.firstName} {contact.lastName}
                                {"\n"}
                                {getPhoneNumberData(
                                    contact.phoneNumbers,
                                    "number",
                                    "phone"
                                )}
                                {"\n"}
                                {getEmailData(contact.emails, "email", "email")}
                            </Text>
                        </View>
                    </View>
                );
            });
        } else {
            return <Text>Loading contacts...</Text>;
        }
    };

    return (
        <KeyboardAvoidingView style={globalStyles.container} behavior="height">
            <ScrollView style={{ flex: 1 }}>
                <View>
                    <Text style={styles.importedContacts}>
                        Imported Contacts
                    </Text>
                    <TouchableOpacity
                        style={{
                            ...globalStyles.button,
                            backgroundColor: toggleCheckBox
                                ? "#38b6ff"
                                : "#cb6ce6",
                        }}
                        onPress={handleSelectAll}
                    >
                        <Text style={styles.selectDeselect}>
                            {toggleCheckBox ? "Deselect All" : "Select All"}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.section}>
                        <Text>{error}</Text>
                        {getContactRows()}
                        <StatusBar style="auto" />
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.saveUpdatesButton}
                        onPress={handleSubmit}
                    >
                        <Ionicons name="send-outline" size={25} color="white" />
                        <Text style={styles.submitButtonText}>
                            Save Updates
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: "#2E8B57",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    importedContacts: {
        ...globalStyles.heading1,
        fontFamily: "Bukhari Script",
        margin: 20,
        padding: 5,
        textAlign: "center",
    },
    selectDeselect: {
        ...globalStyles.paragraph,
        fontWeight: "bold",
        color: "white",
    },
    saveUpdatesButton: {
        ...globalStyles.button,
        backgroundColor: "green",
    },
});

export default ImportContacts;
