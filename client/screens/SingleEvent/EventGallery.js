import {
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
    getStorage,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    metadata,
    ref,
    listAll,
} from "firebase/storage";
import globalStyles from "../../utils/globalStyles";
import { useIsFocused } from "@react-navigation/native";
import { Video } from "expo-av";
import Swiper from "react-native-swiper";

// const dummyPhotos = [
//     "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
//     "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
//     "https://fastly.picsum.photos/id/106/2592/1728.jpg?hmac=E1-3Hac5ffuCVwYwexdHImxbMFRsv83exZ2EhlYxkgY",
//     "https://fastly.picsum.photos/id/155/3264/2176.jpg?hmac=Zgf_oGMJeg18XoKBFmJgp2DgHMRYuorXlDx5wLII9nU",
//     "https://fastly.picsum.photos/id/257/5000/3333.jpg?hmac=B0TMVZJOXC_cBK0gZj5EzCBnCwoBMEyvt9t8AbJDkdA",
//     "https://fastly.picsum.photos/id/254/200/300.jpg?hmac=VoOUXxjWvbLuWPBSHy_pbMAoLSYCaO-3drnOhwvA2yY",
// ];

const EventGallery = (params) => {
    const [event] = useState(params.route.params.event);
    const [uid] = useState(params.route.params.uid);
    const [userName] = useState(params.route.params.userName);
    //const [photos] = useState(params.route.params.event.photos);

    const [eventImages, setEventImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [storage, setStorage] = useState(getStorage());
    const [countPhotos, setCountPhotos] = useState(0);
    const isFocused = useIsFocused();

    //Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [photoIndex, setIndexPhoto] = useState(null);

    const getPhotos = async () => {
        let imageURLs = [];
        const listRef = ref(storage, `event_${event.event_id}`);
        listAll(listRef)
            //console.log("=====>", event.event_id)
            .then((res) => {
                setCountPhotos(res.items.length);
                res.items.forEach((itemRef) => {
                    getDownloadURL(itemRef).then((url) => {
                        imageURLs = [...imageURLs, url];
                        console.log(imageURLs, "imageURLs");
                        setEventImages(imageURLs);
                    });
                });
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    };

    useEffect(() => {
        if (storage) {
            getPhotos();
        }
    }, [isFocused]);

    const renderItem = (item, index) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                setIndexPhoto(eventImages.indexOf(item));
                setModalVisible(true);
            }}
        >
            <Image
                source={{ uri: item }}
                style={{
                    height: screenWidth / 2 - 12,
                    width: screenWidth / 2 - 12,
                    margin: 6,
                    borderRadius: 10,
                }}
            />
        </TouchableOpacity>
    );

    const navigation = useNavigation();
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    return (
        <SafeAreaView style={globalStyles.container}>
            {loading ? (
                <Video
                    source={require("../../../assets/LoadingScreen.mp4")}
                    style={{ flex: 1 }}
                    shouldPlay
                    isLooping
                    resizeMode="cover"
                />
            ) : eventImages.length > 0 ? (
                <>
                    {countPhotos <= 6 && (
                        <>
                            <TouchableOpacity
                                style={{
                                    margin: 12,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() =>
                                    navigation.navigate(
                                        "UploadEventImagesScreen",
                                        {
                                            event: event,
                                            uid: uid,
                                            uploaderName: userName,
                                        }
                                    )
                                }
                            >
                                <Text style={globalStyles.heading3}>
                                    Add your photos
                                </Text>
                                <Ionicons name="add-circle-outline" size={25} />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    ...globalStyles.heading3,
                                    textAlign: "center",
                                }}
                            >
                                {countPhotos} photos
                            </Text>
                        </>
                    )}
                    <Swiper showsButtons={true}>
                        {eventImages.map((photo, index) => (
                            <View key={photo} style={styles.slide1}>
                                <Image
                                    source={{ uri: photo }}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        margin: 6,
                                        borderRadius: 10,
                                    }}
                                />
                            </View>
                        ))}
                    </Swiper>
                </>
            ) : (
                <View
                    style={{
                        ...globalStyles.container,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            ...globalStyles.heading2,
                            textAlign: "center",
                            margin: 12,
                        }}
                    >
                        No photos from{"\n"}
                        {event.name}
                        {"\n"}have been added yet
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("UploadEventImagesScreen", {
                                event: event,
                                uid: uid,
                            })
                        }
                    >
                        <Ionicons name="add-circle-outline" size={55} />
                    </TouchableOpacity>
                    <Text
                        style={{
                            ...globalStyles.heading3,
                            textAlign: "center",
                            margin: 12,
                        }}
                    >
                        Add your photos
                    </Text>
                </View>
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
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#9DD6EB",
    },
    slide2: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#97CAE5",
    },
    slide3: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#92BBD9",
    },
    text: {
        color: "#000",
        fontSize: 30,
        fontWeight: "bold",
    },
});
