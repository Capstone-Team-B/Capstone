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
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    query,
    orderByChild,
    equalTo,
} from "firebase/database";
import Toggle from "react-native-toggle-element";
import globalStyles from "../../utils/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
const BeThereConcise = require("../../../assets/BeThereConcise.png");
const Background = require("../../../assets/Background.png");

const GuestProfileScreen = (params) => {
    const uid = params.route.params.uid;
    const [user, setUser] = useState({});
    const [toggleValue, setToggleValue] = useState(true);
    const [rsvpStatus, setRSVPStatus] = useState(true); //will need to update

    useEffect(() => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setUser(snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <ImageBackground
            source={Background}
            resizeMode="cover"
            style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 25,
                            // fontFamily: "Bukhari Script",
                            padding: 10,
                            fontWeight: "bold",
                        }}
                    >
                        Will you be there?
                    </Text>
                    <Text style={globalStyles.heading3}>
                        Toggle your RSVP status
                    </Text>
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 50,
                    }}
                >
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
                            borderWidth: 8,
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
                {toggleValue ? (
                    <View
                        style={{
                            ...globalStyles.button,
                            backgroundColor: "#38b6ff",
                            padding: 30,
                            borderRadius: 100,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 25,
                                fontFamily: "Bukhari Script",
                                color: "white",
                            }}
                        >
                            I'll BeThere!
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            ...globalStyles.button,
                            backgroundColor: "gray",
                            padding: 30,
                            borderRadius: 100,
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
            {/* <Text>
                <Text style={styles.label}>
                    Name: {user.firstName ? user.firstName : null}{" "}
                    {user.lastName ? user.lastName : null}
                </Text>
            </Text>

            <Text style={styles.label}>
                Phone: {user.phoneNumber ? user.phoneNumber : null}
            </Text>
            <Text style={styles.label}>
                Email: {user.email ? user.email : null}
            </Text> */}
            {rsvpStatus != toggleValue ? (
                <TouchableOpacity
                    style={{
                        ...globalStyles.button,
                         backgroundColor: "#cb6ce6"
                    }}
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
