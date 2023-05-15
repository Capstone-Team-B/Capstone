import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
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
} from "firebase/database";
import MapView, { Marker } from "react-native-maps";
import { removeEmpty } from "../../utils/ArrayUtils";

let gListData = [];

const MapLocationScreen = (params) => {
    const _eventID = "0"; // params.route.params.eventId
    const [eventId, setEventId] = useState(_eventID);
    const [locations, setLocations] = useState([]);
    // const [mapRegion, setmapRegion] = useState({
    //     latitude: 37.78825,
    //     longitude: -122.4324,
    //     latitudeDelta: 0.0922,
    //     longitudeDelta: 0.0421,
    // });

    //

    const [dataInfo, setDataInfo] = useState({
        address: "",
    });

    const [mapRegion, setmapRegion] = useState(null);
    console.log("_eventID", _eventID);
    const dbRef = ref(getDatabase());

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

    const onFilterList = (dInfo) => {
        let dataFiltered = gListData;

        let address = dInfo?.address ?? "";

        console.log("gListdata = ", gListData);

        if (address !== "") {
            dataFiltered = gListData.filter((dataItem) => {
                return dataItem.address
                    ?.toLowerCase()
                    .includes(address.toLowerCase());
            });
        }

        // for (let index = 0; index < dataFiltered.length; index++) {
        //     const element = dataFiltered[index];
        //     const latlon = await fetch(
        //         `https://geocode.maps.co/search?q={${element.location}}`
        //     ).then(async (data) => data.json());
        //     console.log("each", latlon);
        //     element.latitude = latlon[0].lat;
        //     element.longitude = latlon[0].lon;
        // }
        console.log("filtered", dataFiltered, "len" + dataFiltered.length);
        setLocations([...dataFiltered]);
    };

    const onLoadData = () => {
        get(
            query(
                child(dbRef, "locations"),
                orderByChild("event_id"),
                equalTo(_eventID)
            )
        )
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    console.log("shanpshot data", data);
                    //const dataFiltered = removeEmpty(data);
                    gListData = data;
                    onFilterList(dataInfo.address);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        onLoadData();
    }, [_eventID]);
    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                <Text>Addres ddd</Text>
                <TextInput
                    style={[styles.addressInput]}
                    value={dataInfo.address}
                    onChangeText={(val) => {
                        let tempDataInfo = {
                            ...dataInfo,
                            address: val,
                        };

                        onFilterList(tempDataInfo);

                        setDataInfo(tempDataInfo);
                    }}
                ></TextInput>
            </View>
            <View style={{ flex: 1 }}>
                {locations.length > 0 ? (
                    <MapView
                        provider="google"
                        style={{ height: "100%", width: "100%" }}
                        // style={{ alignSelf: "stretch", height: "100%" }}
                        // region={{
                        //     latitude: locations[0].latitude,
                        //     longitude: locations[0].longitude,
                        //     latitudeDelta: 0.4,
                        //     longitudeDelta: 0.5
                        // }}
                        initialRegion={mapRegion}
                    >
                        {locations.map((marker, index) => (
                            <Marker
                                key={index}
                                title={marker.location}
                                description={marker.nameLocation}
                                coordinate={{
                                    latitude: marker.latitude, //marker.latitude,40.715000,
                                    longitude: marker.longitude, //marker.longitude,-74.015800
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
        backgroundColor: "#00FFFF",
    },
});
