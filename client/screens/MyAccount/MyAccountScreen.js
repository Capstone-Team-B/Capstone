import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Pressable,
    ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
    getDatabase,
    ref,
    child,
    get,
    query,
    equalTo,
    orderByChild,
} from "firebase/database";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { auth } from "../../../firebase";
import globalStyles from "../../utils/globalStyles";
const BeThereLogo = require("../../../assets/BeThereConcise.png");
const Background = require("../../../assets/Background.png");

const MyAccountScreen = (props) => {
    const [user, setUser] = useState({});
    // const { uid } = props.route.params.uid;
    let isFocused = useIsFocused();
    console.log("isFocused", isFocused);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const getUserId = async () => {
            const currentUserId = auth.currentUser.uid;
            const dbRef = ref(getDatabase());
            const usersQuery = query(
                child(dbRef, "users"),
                orderByChild("auth_id"),
                equalTo(currentUserId)
            );
            const snapshot = await get(usersQuery);

            if (snapshot.exists()) {
                const data = Object.keys(snapshot.val());
                setUserId(data[0]);
            }
        };
        getUserId();
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${userId}`))
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
    }, [isFocused]);

    const navigation = useNavigation();

    const handlePressCreateEvent = () => {
        navigation.navigate("CreateEvent", { uid: userId });
    };

    const handlePressEditAccount = () => {
        navigation.navigate("EditAccountScreen", user);
    };

    const handlePressViewArchive = () => {
        navigation.navigate("ViewArchiveScreen", { uid: userId });
    };

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("LoginScreen");
            })
            .catch((error) => alert(error.message));
    };
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={Background}
                resizeMode="cover"
                style={{
                    flex: 1,
                    width: "100%",
                }}
            >
                <View style={styles.createEvent}>
                    <TouchableOpacity
                        style={styles.createEvent}
                        onPress={handlePressCreateEvent}
                    >
                        <Image
                            source={BeThereLogo}
                            style={{ height: 200, width: 200 }}
                        />
                        <Text
                            style={{
                                ...globalStyles.heading1,
                                fontFamily: "Bukhari Script",
                            }}
                        >
                            Create an event
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.sectionHeader}>
                    <Text style={globalStyles.heading2}>Account details</Text>
                    <Pressable onPress={handlePressEditAccount}>
                        <Ionicons name="create-outline" size={25} />
                    </Pressable>
                </View>
                <View
                    style={{
                        ...globalStyles.tile,
                        backgroundColor: "white",
                        borderWidth: 0,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <Text style={globalStyles.paragraph}>
                                {user.firstName ? user.firstName : "no data"}{" "}
                                {user.lastName ? user.lastName : "no data"}
                            </Text>
                            <Text style={globalStyles.paragraph}>
                                {user.phoneNumber
                                    ? user.phoneNumber
                                    : "no data"}
                            </Text>
                            <Text style={globalStyles.paragraph}>
                                {user.email ? user.email : "no data"}
                            </Text>
                            <Text style={globalStyles.paragraph}>
                                {user.homeCity ? user.homeCity : "no data"}
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
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "bold",
                            marginBottom: 5,
                        }}
                    >
                        Guest Preferences
                    </Text>

                    <Text>
                        Accessibility:{" "}
                        {user.accessibility ? user.accessibility : "no data"}
                    </Text>
                    <Text>
                        Dietary restrictions:{" "}
                        {user.dietary ? user.dietary : "no data"}{" "}
                    </Text>
                </View>
                <View style={styles.sectionHeader}>
                    <Text style={globalStyles.heading2}>Archive</Text>
                    {/* <Pressable onPress={handlePressViewArchive}> */}
                    <Ionicons name="archive-outline" size={25} />
                    {/* </Pressable> */}
                </View>
                <View
                    style={{
                        ...globalStyles.tile,
                        backgroundColor: "white",
                        borderWidth: 0,
                    }}
                >
                    <View>
                        <Text style={globalStyles.paragraph}>
                            Past event's I've attended/hosted
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                    <Text
                        style={{
                            ...globalStyles.paragraph,
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        Sign out
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
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
    },
    createEventTitle: {
        fontSize: 24,
    },
    section: {
        margin: 12,
        borderWidth: 2,
        borderColor: "#38b6ff",
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionHeader: {
        marginLeft: 18,
        marginRight: 18,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: "cover",
    },
    button: {
        backgroundColor: "#cb6ce6",
        padding: 15,
        margin: 10,
        borderRadius: 10,
        alignItems: "center",
    },
});
