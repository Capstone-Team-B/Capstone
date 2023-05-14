import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import Feather from "react-native-vector-icons/Feather";
import { getDatabase, ref, child, get } from "firebase/database";
import SignOutBtn from "./SignOutBtn";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../utils/globalStyles";
const BeThereLogo = require("../../../assets/BeThereConcise.png");

const MyAccountScreen = (props) => {
    const [user, setUser] = useState({});
    const { uid } = props.route.params;

    useEffect(() => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(
                        "this is the data from the database -->",
                        snapshot.val()
                    );
                    setUser(snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // console.log("uid in MyAccountScreen -->", uid);
    // console.log("user on MyAccountScreen -->", user);
    const navigation = useNavigation();

    const handlePressCreateEvent = () => {
        navigation.navigate("CreateEvent");
    };

    const handlePressEditAccount = () => {
        // {/* Not sure why but this directs to edit event photo screen */}
        navigation.navigate("EditAccountScreen", user);
    };

    const handlePressEditPrefs = () => {
        navigation.navigate("EditPrefsScreen", user);
    };

    const handlePressViewArchive = () => {
        navigation.navigate("ViewArchiveScreen");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.createEvent}>
                <TouchableOpacity
                    style={styles.createEvent}
                    onPress={handlePressCreateEvent}
                >
                    <Image
                        source={BeThereLogo}
                        style={{ height: 200, width: 200 }}
                    />
                    <Text style={globalStyles.heading1}>Create an event</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Account details</Text>
                {/* Not sure why but this directs to edit event photo screen */}
                <Pressable onPress={handlePressEditAccount}>
                    <Feather name="edit" size={20} />
                </Pressable>
            </View>
            <View style={styles.section}>
                <View>
                    <Text style={globalStyles.paragraph}>
                        First name:{" "}
                        {user.firstName ? user.firstName : "no data"}
                    </Text>
                    <Text style={globalStyles.paragraph}>
                        Last name: {user.lastName ? user.lastName : "no data"}
                    </Text>
                    <Text style={globalStyles.paragraph}>
                        Phone: {user.phoneNumber ? user.phoneNumber : "no data"}
                    </Text>
                    <Text style={globalStyles.paragraph}>
                        Email: {user.email ? user.email : "no data"}
                    </Text>
                    <Text style={globalStyles.paragraph}>
                        Location: {user.homeCity ? user.homeCity : "no data"}
                    </Text>
                </View>
                <View>
                    <Image
                        style={styles.profilePic}
                        source={{
                            uri: user.profilePic,
                        }}
                    />
                </View>
            </View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Guest Preferences</Text>
                <Pressable onPress={handlePressEditPrefs}>
                    <Feather name="edit" size={20} />
                </Pressable>
            </View>
            <View style={styles.section}>
                <View>
                    <Text>
                        Accessibility:{" "}
                        {user.accessibility ? user.accessibility : "no data"}
                    </Text>
                    <Text>
                        Dietary restrictions:{" "}
                        {user.dietary ? user.dietary : "no data"}{" "}
                    </Text>
                </View>
            </View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Archive</Text>
                <Pressable onPress={handlePressViewArchive}>
                    <Feather name="rewind" size={20} />
                </Pressable>
            </View>
            <View style={styles.section}>
                <View>
                    <Text style={globalStyles.paragraph}>
                        Past event's I've attended/hosted
                    </Text>
                </View>
            </View>
            <SignOutBtn />
        </SafeAreaView>
    );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    createEvent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 5,
        // borderStyle: "dotted",
        // borderRadius: 250,
        // width: 250,
        // height: 250,
        // margin: 20
    },
    createEventTitle: {
        fontSize: 24,
    },
    section: {
        margin: 10,
        borderWidth: 2,
        borderColor: "dodgerblue",
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionHeader: {
        marginLeft: 14,
        marginRight: 14,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    // sectionTitle: {
    //   fontSize: 18,
    //   fontWeight: "bold",
    // },
    profilePic: {
        width: 90,
        height: 90,
        borderRadius: 50,
        resizeMode: "cover",
    },
});
