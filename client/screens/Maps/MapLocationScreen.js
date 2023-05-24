//REACT IMPORTS
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Button,
    Keyboard,
    Alert
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
// FIREBASE IMPORTS
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    query,
    orderByChild,
    equalTo,
    push,
} from "firebase/database";
// STATE IMPORTS
import { useAtom } from "jotai";
import { user as userStore } from "../../store/user";
import EmptyState from "../../Components/EmptyState/Index";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";

const MapLocationScreen = (params) => {
    // COMPONENT VARIABLES
    const colors = [
        "red",
        "tomato",
        "green",
        "blue",
        "aqua",
        "teal",
        "violet",
        "purple",
        "indigo",
        "turquoise",
        "navy",
        "plum",
    ];
    const dbRef = ref(getDatabase());

    // PROPS & PARAMS
    const eventHost = params.route.params.eventHost;

    // STATE
    const [storeUser, setStoreUser] = useAtom(userStore);
    const [eventId, setEventId] = useState();
    const [locations, setLocations] = useState([]);
    const [dataInfo, setDataInfo] = useState({
        address: "",
    });
    const [hiddenForm, setHiddenForm] = useState(false);
    const [mapRegion, setmapRegion] = useState(null);

    // USEEFFECTS
    useEffect(() => {
        if (params.route.params.eventId) {
            setEventId(params.route.params.eventId);
        }
    }, [params.route.params]);

    useEffect(() => {
        if (locations.length > 0) {
            setmapRegion({
                latitude: locations[0].latitude,
                longitude: locations[0].longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    }, [locations]);

    // FUNCTIONS
    const onLoadData = () => {
        get(
            query(
                child(dbRef, "locations"),
                orderByChild("event_id"),
                equalTo(eventId)
            )
        )
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const _data = Object.keys(data).map((key) => ({
                        ...data[key],
                    }));
                    setLocations([..._data]);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (eventId) {
            onLoadData();
        }
    }, [eventId]);

    const handleSave = async () => {
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };
        fetch(
            `https://geocode.maps.co/search?q=${dataInfo.address}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                const latitude = result[0].lat;
                const longitude = result[0].lon;
                const newLocation = {
                    address: dataInfo.address,
                    label: dataInfo.label,
                    latitude,
                    longitude,
                    name: dataInfo.name,
                    event_id: eventId,
                };
                const locationRef = child(dbRef, "locations");
                const newLocationRef = push(locationRef);
                const newEventId = newLocationRef.key;
                set(newLocationRef, newLocation).then(() => {
                    setDataInfo({});
                    onLoadData();
                    Keyboard.dismiss();
                });
            })
            .catch((error) => {
                console.log("error", error);
                Keyboard.dismiss();
                Alert.alert("Please enter a valid address (123 Street, City, State, Zipcode)");                
            });
    };

    const toggleHiddenForm = () => {
        setHiddenForm(!hiddenForm);
    };

    return (
        <KeyboardAvoidingView style={globalStyles.container}>
            {eventHost === storeUser.uid && !hiddenForm && (
                <View>
                    <View>
                        <Text
                            style={{...globalStyles.labelInput}}
                        >
                            Name
                        </Text>
                        <TextInput
                            style={globalStyles.input}
                            value={dataInfo.name}
                            onChangeText={(val) => {
                                let tempDataInfo = {
                                    ...dataInfo,
                                    name: val,
                                };
                                setDataInfo(tempDataInfo);
                            }}
                        ></TextInput>
                    </View>
                    <View>
                        <Text
                            style={{...globalStyles.labelInput}}
                        >
                            Address
                        </Text>
                        <TextInput
                            style={globalStyles.input}
                            value={dataInfo.address}
                            onChangeText={(val) => {
                                let tempDataInfo = {
                                    ...dataInfo,
                                    address: val,
                                };

                                setDataInfo(tempDataInfo);
                            }}
                        ></TextInput>
                    </View>
                    <View>
                        <Text
                            style={{...globalStyles.labelInput}}
                        >
                            Label
                        </Text>
                        <TextInput
                            style={globalStyles.input}
                            value={dataInfo.label}
                            onChangeText={(val) => {
                                let tempDataInfo = {
                                    ...dataInfo,
                                    label: val,
                                };

                                setDataInfo(tempDataInfo);
                            }}
                        ></TextInput>
                    </View>

                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Button title="Save" onPress={handleSave}></Button>
                    </View>
                </View>
            )}
            {locations.length > 0 && eventHost === storeUser.uid && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {!hiddenForm ? (
                        <>
                            <Ionicons
                                onPress={toggleHiddenForm}
                                name={"chevron-up"}
                                size={50}
                                color={"black"}
                            />
                            <Text>Hide</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons
                                onPress={toggleHiddenForm}
                                name={"chevron-down"}
                                size={50}
                                color={"black"}
                            />
                            <Text>Add Event Locations</Text>
                        </>
                    )}
                </View>
            )}
            <View style={{ flex: 1 }}>
                {locations.length > 0 ? (
                    <MapView
                        provider="google"
                        style={{ height: "100%", width: "100%" }}
                        initialRegion={mapRegion}
                    >
                        {locations.map((marker, index) => (
                            <Marker
                                key={index}
                                title={"test"}
                                description={marker.where}
                                coordinate={{
                                    latitude: marker.latitude,
                                    longitude: marker.longitude,
                                }}
                                pinColor={colors[index] || "red"}
                            >
                                <Callout>
                                    <View>
                                        <Text>{marker.name}</Text>
                                        <Text>{marker.where}</Text>
                                        <Text>{marker.label}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                ) : (
                    <EmptyState
                        nameIcon="calendar-outline"
                        title="No Event Locations Avaliable"
                        subtitle="The host for this event has not pinned any locations for your event"
                        iconColor={"#cb6ce6"}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default MapLocationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: "stretch",
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
        backgroundColor: "transparent",
    },
    addressInput: {
        borderWidth: 1,
        borderColor: "gray",
        height: 40,
        borderRadius: 8,
    },
});
