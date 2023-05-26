// REACT IMPORTS
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Switch,
    ImageBackground,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Toggle from "react-native-toggle-element";
import Ionicons from "react-native-vector-icons/Ionicons";
// FIREBASE IMPORTS
import { auth } from "../../../firebase";
import { getDatabase, ref, child, get, query, update } from "firebase/database";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
const BeThereConcise = require("../../../assets/BeThereConcise.png");
const Background = require("../../../assets/Background.png");

const GuestProfileScreen = (params) => {
    // COMPONENT VARIABLES
    const navigation = useNavigation();

    // PROPS & PARAMS
    const uid = params.route.params.uid;
    const event = params.route.params.event;
    const userEventId = params.route.params.userEventId;

    // STATE
    const [user, setUser] = useState({});
    const [rsvpStatus, setRSVPStatus] = useState(
        event.guestList[uid].attending
    );
    const [toggleValue, setToggleValue] = useState(rsvpStatus);

    console.log(
        "event.guestList[uid].attending ON NAV TO SCREEN -->",
        event.guestList[uid].attending
    );

    // USEEFFECT
    useEffect(() => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setUser(snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // FUNCTIONS
    const sendRsvpUpdate = async () => {
        const dbRef = ref(getDatabase());
        const userEventRef = child(
            dbRef,
            `users/${uid}/userEvents/${userEventId}`
        );
        const updateUserEvent = {
            attending: toggleValue,
        };
        await update(userEventRef, updateUserEvent);
        const eventRef = child(
            dbRef,
            `events/${event.event_id}/guestList/${uid}`
        );
        const updateEventRef = { attending: toggleValue };
        try {
            await update(eventRef, updateEventRef);
            get(child(dbRef, `events/${event.event_id}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const updatedEvent = snapshot.val();
                    console.log("updatedevent-->", updatedEvent.guestList[uid]);
                    navigation.navigate("SingleEvent", {
                        uid: uid,
                        event: updatedEvent,
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
        Alert.alert("Updated RSVP sent");
    };

    return (
        <ImageBackground
            source={Background}
            resizeMode="cover"
            style={styles.imageBG}
        >
            <View style={styles.rsvpContainer}>
                {/* <View style={{ margin: 40 }}> */}
                    {toggleValue ? (
                        <View style={styles.rsvpYes}>
                            <Text style={styles.rsvpText}>I'll BeThere</Text>
                        </View>
                    ) : (
                        <View style={styles.rsvpNo}>
                            <Text style={styles.rsvpText}>Can't make it</Text>
                        </View>
                    )}
                {/* </View> */}
                <View style={styles.headerContainer}>
                    <Text style={styles.willYouBeThere}>
                        Will you be there?
                    </Text>
                    <Text style={globalStyles.heading3}>
                        Toggle your RSVP status
                    </Text>
                </View>

                <Switch
                    trackColor={{ false: "gray", true: "#38b6ff" }}
                    thumbColor={"white"}
                    // ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setToggleValue(!toggleValue)}
                    value={toggleValue}
                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                />

                {/* <View style={{ position: "fixed", bottom: 0 }}>
                    <Toggle
                        value={toggleValue}
                        onPress={(val) => setToggleValue(val)}
                        thumbButton={{
                            width: 60,
                            height: 60,
                            radius: 50,
                        }}
                        trackBar={{
                            width: 200,
                            height: 40,
                            radius: 30,
                            margin: 20,
                            inActiveBackgroundColor: "white",
                            activeBackgroundColor: "white",
                            borderWidth: 4,
                            borderActiveColor: "black",
                            borderInActiveColor: "black",
                        }}
                        thumbInActiveComponent={
                            <View
                                style={{
                                    backgroundColor: "black",
                                    width: 60,
                                    height: 60,
                                    borderRadius: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Ionicons
                                    name="thumbs-down-outline"
                                    size={35}
                                    color={"white"}
                                />
                            </View>
                        }
                        thumbActiveComponent={
                            <Image
                                source={BeThereConcise}
                                style={{
                                    height: 100,
                                    width: 100,
                                    alignSelf: "center",
                                }}
                            />
                        }
                    />
                </View> */}
            </View>
            {rsvpStatus != toggleValue ? (
                <TouchableOpacity
                    style={styles.sendUpdateBtn}
                    onPress={sendRsvpUpdate}
                >
                    <Ionicons name="send-outline" size={25} color={"white"} />
                    <Text style={{ ...globalStyles.heading3, color: "white" }}>
                        Send RSVP update to host
                    </Text>
                </TouchableOpacity>
            ) : null}
        </ImageBackground>
    );
};

export default GuestProfileScreen;

const styles = StyleSheet.create({
    imageBG: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        margin: 20,
        // marginBottom: 60,
    },
    willYouBeThere: {
        fontSize: 20,
        padding: 10,
        fontWeight: "bold",
    },
    rsvpContainer: {
        justifyContent: "center",
        alignItems: "center",
        // height: 150,
        // padding: 20,
        margin: 60,
    },
    rsvpYes: {
        // ...globalStyles.button,
        backgroundColor: "#38b6ff",
        height: 175,
        width: 175,
        // padding: 30,
        borderRadius: 175,
        justifyContent: "center",
        alignItems: "center",
    },
    rsvpText: {
        fontSize: 25,
        fontFamily: "Bukhari Script",
        color: "white",
        textAlign: "center",
    },
    rsvpNo: {
        backgroundColor: "black",
        height: 175,
        width: 175,
        justifyContent: "center",
        alignItems: "center",
    },
    sendUpdateBtn: {
        ...globalStyles.button,
        backgroundColor: "#cb6ce6",
        // position: "absolute",
        // bottom: "20%",
    },
});
