import {
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { getDatabase, ref, child, get, query } from "firebase/database";
import Ionicons from "react-native-vector-icons/Ionicons";

const EventGallery = (params) => {
    const event = params.route.params.event;
    const uid = params.route.params.uid;
    const photos = params.route.params.event.photos;

    const [eventImages, setEventImages] = useState([]);
    const [userName, setUserName] = useState({});
    const [loading, setLoading] = useState(true);

    const dbRef = ref(getDatabase());

    // useEffect to get all logged-in user info to pass along with image upload
    useEffect(() => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setUserName(`${snapshot.val().firstName} ${snapshot.val().lastName}`);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const getPhotos = async () => {
        let photoArray = [];
        for (let i = 0; i < photos.length; i++) {
            try {
                const photosQuery = query(child(dbRef, `photos/${photos[i]}`));
                await get(photosQuery)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            console.log(data);
                            photoArray = [...photoArray, data];
                        } else {
                            console.log("No data available");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
            }
        }
        setEventImages(photoArray);
    };

    useEffect(() => {
        getPhotos();
    }, [photos]);
    console.log("event images -->", eventImages);

    const navigation = useNavigation();
    const screenWidth = Dimensions.get("window").width;

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
            {eventImages.length > 0 ? (
                <>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("UploadEventImagesScreen", {
                                event: event,
                                uid: uid,
                                uploaderName: userName
                            })
                        }
                        style={{ flexDirection: "row" }}
                    >
                        <Text>Upload Images</Text>
                        <Ionicons name="add-circle-outline" size={25} />
                    </TouchableOpacity>
                    <FlatList
                        data={eventImages}
                        numColumns={2}
                        contentContainerStyle={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("SinglePhoto", {
                                        photo: item,
                                    })
                                }
                            >
                                <Image
                                    source={{ uri: item.uri }}
                                    style={{
                                        height: screenWidth / 2.2,
                                        width: screenWidth / 2.2,
                                        margin:
                                            (screenWidth -
                                                (screenWidth / 2.2) * 2) /
                                            4,
                                        borderRadius: 10,
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </>
            ) : (
                <>
                    <Text>
                        No pictures from {event.name} have been added... yet!
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("UploadEventImagesScreen", {
                                event: event,
                                uid: uid,
                            })
                        }
                        style={{ flexDirection: "row" }}
                    >
                        <Text>Upload Images</Text>
                        <Ionicons name="add-circle-outline" size={25} />
                    </TouchableOpacity>
                </>
            )}
            {/* </View> */}
        </SafeAreaView>
    );
};

export default EventGallery;

const styles = StyleSheet.create({
    imageContainer: {},
    image: {
        height: 200,
        width: "50%",
        aspectRatio: 1,
        resizeMode: "cover",
        margin: 8,
        borderRadius: 10,
    },
});
