// REACT IMPORTS
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Alert,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// FIREBASE IMPORTS
import {
    getDatabase,
    ref,
    child,
    set,
    push,
    update,
    get,
    query,
    orderByChild,
    equalTo,
} from "firebase/database";
// PROJECT IMPORTS
const PurpleBG = require("../../../assets/PurpleBG.png");
import globalStyles from "../../utils/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
// import { Platform, PermissionsAndroid, Linking } from "react-native";
// import * as SMS from "expo-sms";

const CreateGuestList = (params) => {
    // COMPONENT VARIABLES
    const navigation = useNavigation();
    // const bodySMS = `You have been invited to a new event on BeThere! Open or download the BeThere app to view your invite!`;

    // PROPS & PARAMS
    const event = params.route.params.event;
    const uid = params.route.params.uid;
    const eventId = event.event_id;

    // STATE
    const [guestList, setGuestList] = useState([]);

    // FUNCTIONS
    const handleAddGuest = () => {
        const newGuestList = [...guestList];
        newGuestList.push({
            phoneNumber: "",
            email: "",
            firstName: "",
            lastName: "",
        });
        setGuestList(newGuestList);
    };

    const handleDeleteGuest = (index) => {
        const newGuestList = [...guestList];
        newGuestList.splice(index, 1);
        setGuestList(newGuestList);
    };

    const handleUpdateGuest = (index, field, value) => {
        const newGuestList = [...guestList];
        newGuestList[index][field] = value;
        setGuestList(newGuestList);
    };

    const handleSubmit = async () => {
        for (const guest of guestList) {
            if (!guest.phoneNumber || !guest.firstName || !guest.lastName) {
                Alert.alert("Please fill in all required fields");
                return;
            }
        }

        const dbRef = ref(getDatabase());
        const usersRef = child(dbRef, `users`);
        const guestListRef = child(dbRef, `events/${eventId}/guestList`);

        for (const guest of guestList) {
            const {
                phoneNumber: guestPhone,
                email: guestEmail,
                firstName: guestFirstname,
                lastName: guestLastname,
            } = guest;

            const formattedPhone = guestPhone.replace(/\D/g, "");
            if (formattedPhone.length !== 10) {
                Alert.alert("Invalid phone number");
                return;
            }

            const newGuestListData = {
                phoneNumber: formattedPhone.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                ),
                email: guestEmail,
                firstName: guestFirstname,
                lastName: guestLastname,
            };

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
                Alert.alert("Something went wrong, please try again.");
                return;
            }
        }
        navigation.navigate("SingleEvent", { uid: uid, event: event });
    };

    // const initiateSMS = async (guestPhone) => {
    //     try {
    //         if (Platform.OS === "android") {
    //             console.log(Platform.OS, "permission granted? ---->", permission === PermissionsAndroid.RESULTS.GRANTED)
    //             const permission = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.SEND_SMS
    //                 );
    //             if (permission === PermissionsAndroid.RESULTS.GRANTED) {
    //                 SmsManager.sendMessageWithoutThreadID(
    //                     guestPhone,
    //                     bodySMS,
    //                     null,
    //                     null
    //                 );
    //                 console.log(`SMS sent successfully to ${guestPhone}`);
    //             } else if (permission === PermissionsAndroid.RESULTS.DENIED) {
    //                 console.log('Permission to send SMS denied');
    //                 return false;
    //             } else if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    //                 console.log('Permission to send SMS permanently denied');
    //                 return false;
    //             } else {
    //                 console.log('Permission request failed');
    //                 return false;
    //             }
    //         } else if (Platform.OS === "ios") {
    //             Alert.alert(
    //                 "iOS devices do not allow BeThere to send bulk SMS messages on your behalf. Please add your guests one at a time to send SMS invites to each guest."
    //             );
    //             const canSendText = await SMS.isAvailableAsync();
    //             if (canSendText) {
    //                 const url = `sms:${guestPhone}&body=${encodeURIComponent(
    //                     bodySMS
    //                 )}`;
    //                 Linking.openURL(url).catch((error) => {
    //                     console.log(
    //                         `Failed to open SMS app for ${guestPhone}:`,
    //                         error
    //                     );
    //                 });
    //             } else {
    //                 console.log("SMS service is not available on this device");
    //             }
    //         } else {
    //             console.log(
    //                 "Sending SMS automatically is not supported on this platform"
    //             );
    //         }
    //     } catch (error) {
    //         console.log(
    //             `Error occurred when sending SMS to ${guestPhone}:`,
    //             error
    //         );
    //     }
    // };

    return (
        <KeyboardAvoidingView style={styles.keyboardView} behavior="height">
            <ImageBackground
                source={PurpleBG}
                resizeMode="cover"
                style={styles.imageBG}
            >
                <ScrollView>
                    <View>
                        <Text style={styles.guestListHeader}>
                            Send invites{"\n"}to your event
                        </Text>
                        <View>
                            {guestList.map((guest, index) => (
                                <View style={{ ...styles.section }} key={index}>
                                    <TextInput
                                        style={globalStyles.input}
                                        placeholder="First name"
                                        value={guest.firstName}
                                        onChangeText={(value) =>
                                            handleUpdateGuest(
                                                index,
                                                "firstName",
                                                value
                                            )
                                        }
                                        required={true}
                                    />
                                    <TextInput
                                        style={globalStyles.input}
                                        placeholder="Last name"
                                        value={guest.lastName}
                                        onChangeText={(value) =>
                                            handleUpdateGuest(
                                                index,
                                                "lastName",
                                                value
                                            )
                                        }
                                        required={true}
                                    />
                                    <TextInput
                                        style={globalStyles.input}
                                        placeholder="Phone number"
                                        value={guest.phoneNumber}
                                        onChangeText={(value) =>
                                            handleUpdateGuest(
                                                index,
                                                "phoneNumber",
                                                value
                                            )
                                        }
                                        required={true}
                                    />
                                    <TextInput
                                        style={globalStyles.input}
                                        placeholder="Email address (optional)"
                                        value={guest.email}
                                        onChangeText={(value) =>
                                            handleUpdateGuest(
                                                index,
                                                "email",
                                                value
                                            )
                                        }
                                        required={false}
                                    />
                                    <View style={styles.justAlign}>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() =>
                                                handleDeleteGuest(index)
                                            }
                                        >
                                            <Ionicons
                                                name="close-circle-outline"
                                                size={25}
                                                color="white"
                                                marginBottom={12}
                                            />
                                            <Text style={styles.buttonText}>
                                                Cancel invite
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.importButton}
                            onPress={() =>
                                navigation.navigate("Import Contacts", {
                                    event: event,
                                    uid: uid,
                                })
                            }
                        >
                            <Ionicons
                                name="phone-portrait-outline"
                                size={25}
                                color="white"
                            />
                            <Text style={styles.buttonText}>
                                Import from Contacts
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.manualAddButton}
                            onPress={handleAddGuest}
                        >
                            <Ionicons
                                name="keypad-outline"
                                size={25}
                                color="white"
                            />
                            <Text style={styles.buttonText}>
                                Add New Guest Manually
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {guestList.length > 0 && (
                            <TouchableOpacity
                                style={styles.sendInvitesButton}
                                onPress={handleSubmit}
                            >
                                <Ionicons
                                    name="send-outline"
                                    size={25}
                                    color="white"
                                />
                                <Text style={styles.buttonText}>
                                    Save Updates & Send Invites
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.justAlign}>
                        <TouchableOpacity
                            style={styles.viewGuests}
                            onPress={() => {
                                navigation.navigate("GuestListScreen", {
                                    event: event,
                                });
                            }}
                        >
                            <Ionicons
                                name="people-outline"
                                size={25}
                                color="#38b6ff"
                            />
                            <Text style={styles.buttonText}>
                                View All Guests
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    section: {
        margin: 12,
    },
    deleteButton: {
        ...globalStyles.button,
        width: 150,
        backgroundColor: "red",
    },
    keyboardView: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    imageBG: {
        flex: 1,
        width: "100%",
    },
    guestListHeader: {
        ...globalStyles.heading1,
        fontFamily: "Bukhari Script",
        margin: 20,
        padding: 5,
        textAlign: "center",
    },
    justAlign: {
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        ...globalStyles.paragraph,
        fontWeight: "bold",
        color: "white",
    },
    importButton: {
        ...globalStyles.button,
        backgroundColor: "#cb6ce6",
    },
    viewGuests: {
        ...globalStyles.button,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#38b6ff",
    },
    sendInvitesButton: {
        ...globalStyles.button,
        backgroundColor: "green",
    },
    manualAddButton: {
        ...globalStyles.button,
        backgroundColor: "#38b6ff",
    },
});

export default CreateGuestList;
