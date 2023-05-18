import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ImageBackground,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, child, get, update } from "firebase/database";
import Toggle from "react-native-toggle-element";
import globalStyles from "../../utils/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
const BeThereConcise = require("../../../assets/BeThereConcise.png");
const Background = require("../../../assets/Background.png");

const GuestProfileScreen = (params) => {
    const uid = params.route.params.uid;
    const event = params.route.params.event;
    const [user, setUser] = useState({});
    const [rsvpStatus, setRSVPStatus] = useState(event.guestList[uid].attending);
    const [toggleValue, setToggleValue] = useState(rsvpStatus);

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
    const navigation = useNavigation();

    const sendRsvpUpdate = async () => {
        const dbRef = ref(getDatabase());
        const userEventRef = child(
            dbRef,
            `users/${uid}/userEvents/${event.event_id}`
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
        await update(eventRef, updateEventRef);

        Alert.alert("Updated RSVP sent")
        navigation.navigate("SingleEvent", {uid: uid, event: event});
    };

    return (
        <ImageBackground
            source={Background}
            resizeMode="cover"
            style={{
                flex: 1,
                width: "100%",
                // justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    margin: 20,
                    marginBottom: 60,
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        padding: 10,
                        fontWeight: "bold",
                    }}
                >
                    Will you be there?
                </Text>
                <Text style={globalStyles.paragraph}>
                    Toggle your RSVP status
                </Text>
            </View>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 150,
                    padding: 20,
                }}
            >
                <View style={{ margin: 40 }}>
                    {toggleValue ? (
                        <View
                            style={{
                                ...globalStyles.button,
                                backgroundColor: "#38b6ff",
                                height: 175,
                                width: 175,
                                padding: 30,
                                borderRadius: 175,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontFamily: "Bukhari Script",
                                    color: "white",
                                    textAlign: "center",
                                }}
                            >
                                I'll BeThere
                            </Text>
                        </View>
                    ) : (
                        <View
                            style={{
                                backgroundColor: "black",
                                height: 175,
                                width: 175,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontFamily: "Bukhari Script",
                                    color: "white",
                                }}
                            >
                                Can't make it
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{ position: "fixed", bottom: 0 }}>
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
                </View>
            </View>
            {rsvpStatus != toggleValue ? (
                <TouchableOpacity
                    style={{
                        ...globalStyles.button,
                        backgroundColor: "#cb6ce6",
                        position: "absolute",
                        bottom: "20%",
                    }}
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    container: {
        width: "90%",
        borderRadius: 8,
        border: 1,
        borderWidth: 1,
        borderColor: "gray",
        padding: 12,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        marginTop: 8,
    },
    label: {
        fontWeight: "bold",
    },
});
