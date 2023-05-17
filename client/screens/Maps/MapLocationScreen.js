import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Button,
    Keyboard,
} from "react-native";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    query,
    orderByChild,
    equalTo,
    orderByValue,
    push,
} from "firebase/database";
import MapView, { Callout, Marker } from "react-native-maps";
import { useAtom } from "jotai";
import { user as userStore } from "../../store/user";
import globalStyles from "../../utils/globalStyles";

const MapLocationScreen = (params) => {
    const eventHost = params.route.params.eventHost;
    const [storeUser, setStoreUser] = useAtom(userStore);

    const [eventId, setEventId] = useState();
    const [locations, setLocations] = useState([]);

    const [dataInfo, setDataInfo] = useState({
        address: "",
    });

    const [mapRegion, setmapRegion] = useState(null);

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
                    console.log("shanpshot data", data);
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
                    console.log(locations);
                    onLoadData();
                    Keyboard.dismiss();
                });
            })
            .catch((error) => console.log("error", error));
    };
    return (
        <KeyboardAvoidingView style={globalStyles.container}>
            {eventHost === storeUser.uid && (
                <View>
                    <View>
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                            }}
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
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                            }}
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
                            style={{
                                ...globalStyles.paragraph,
                                marginBottom: 12,
                            }}
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
                        style={{ paddingVertical: 10, paddingHorizontal: 10 }}
                    >
                        <Button title="Save" onPress={handleSave}></Button>
                    </View>
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
                    <Text>Not events</Text>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default MapLocationScreen;

const styles = StyleSheet.create({
    container: {
        // ...StyleSheet.absoluteFillObject,
        // justifyContent: "flex-end",
        // alignItems: "center",
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
