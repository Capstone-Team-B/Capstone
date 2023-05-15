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
import MapView, { Marker } from "react-native-maps";

const MapLocationScreen = (params) => {
    const [eventId, setEventId] = useState();
    const [locations, setLocations] = useState([]);

    const [dataInfo, setDataInfo] = useState({
        address: "",
    });

    const [mapRegion, setmapRegion] = useState(null);

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
        console.log("helloooo", dataInfo.address);
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
                console.log("hlllllllll", eventId)
                set(newLocationRef, newLocation).then(() => {
                    setDataInfo({});
                    console.log(locations);
                    onLoadData();
                    Keyboard.dismiss()
                });
            })
            .catch((error) => console.log("error", error));
    };
    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                <Text>Name</Text>
                <TextInput
                    style={[styles.addressInput]}
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

            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                <Text>Address</Text>
                <TextInput
                    style={[styles.addressInput]}
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
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                <Text>Label</Text>
                <TextInput
                    style={[styles.addressInput]}
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

            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                <Button title="Save" onPress={handleSave}></Button>
            </View>

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
                                title={marker.location}
                                description={marker.nameLocation}
                                coordinate={{
                                    latitude: marker.latitude, 
                                    longitude: marker.longitude, 
                                }}
                            />
                        ))}
                    </MapView>
                ) : (
                    <Text>Not events</Text>
                )}
                <Text> Maps and Events {eventId}</Text>
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
