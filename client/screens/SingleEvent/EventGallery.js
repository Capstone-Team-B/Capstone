import {
    StyleSheet,
    Text,
    TextInput,
    ScrollView,
    SafeAreaView,
    FlatList,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
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
import _ from "lodash";
import {
    child,
    get,
    ref as dbrefF,
    getDatabase,
    query,
    orderByChild,
    equalTo,
    set,
    push
} from "firebase/database";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
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
    const [isSearchText, setIsSearchText] = useState(false);
    const [userList, setUserList] = useState([
        {
            id: 1,
            name: "Mariko Timothy",
        },
        {
            id: 2,
            name: "Eldora Seaton ",
        },
        {
            id: 3,
            name: "Toshia Ellisor ",
        },
        {
            id: 4,
            name: "Carie Bethune",
        },
        {
            id: 5,
            name: "Tomoko Jacobi",
        },
    ]);

    const [tagList, setTagList] = useState([]);
    const [cordinates, setCordinates] = useState({ top: 0, left: 0 });
    const [imageSelected, setImageSelected] = useState('');

    const navigation = useNavigation();
    const dbRef = dbrefF(getDatabase());

    const getGuesses = async () => {
        try {
            await get(query(child(dbRef, `events/${event.event_id}/guestList`)))
            .then(async(guestIdsData) => {
                if (guestIdsData.exists()) {
                    const data = guestIdsData.val();
                    const guestIds = Object.keys(data);
                    
                    let guests = []

                    for (let index = 0; index < guestIds.length; index++) {
                        const guestId = guestIds[index];
                        await get(query(child(dbRef, `users/${guestId}`)))
                        .then((guestUsers) => {
                            if (guestUsers.exists()) {
                                const data = guestUsers.val();
                                guests.push(data)
                            } else {
                                console.log("no guests in this event");
                            }
                        });
                    }
                    setUserList(guests)

                } else {
                    console.log("no guests in this event");
                }
            });
        } catch (error) {
            console.error("err", error);
        }
    };

    const getPhotoTags = async () => {
        try {
            await get(query(child(dbRef, `photoTags`), orderByChild("event_id"),
            equalTo(event.event_id)))
            .then(async(photoTagsData) => {
                if (photoTagsData.exists()) {
                    const data = photoTagsData.val();
                    //const tags = Object.keys(data);
                    const tags = Object.keys(data).map((key) => ({
                        ...data[key],
                    }));
                    console.info('tags', tags)
                    setTagList(tags)

                } else {
                    console.log("no tags in this event");
                }
            });
        } catch (error) {
            console.error("err", error);
        }
    };

    const getPhotos = async () => {
        let imageURLs = [];
        const listRef = ref(storage, `event_${event.event_id}`);
        listAll(listRef)
            .then((res) => {
                setCountPhotos(res.items.length);
                res.items.forEach((itemRef) => {
                    getDownloadURL(itemRef).then((url) => {
                        imageURLs = [...imageURLs, url];
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

    const handlePress = (evt, photo) => {
        let top = evt.nativeEvent.locationY;
        let left = evt.nativeEvent.locationX;
        console.log("cordinates", top + "---" + left);
        setIsSearchText(true);
        setCordinates({ top, left });
        setImageSelected(photo)
    };

    const tagUser = async (guest) => {
        console.info('tagged', guest)
        let newView = {
            event_id: event.event_id,
            imageUrl: imageSelected,
            top: cordinates.top,
            left: cordinates.left,
            user: guest.firstName,
        };
        console.log("newView");
        console.log(newView);
        try {
            await set(push(child(dbRef, `photoTags`)), newView);
            setTagList(tagList.concat([newView]));
        } catch (error) {
            console.error('tag', error)
        }
        setIsSearchText(false);
    };

    const dynamicStyle = (location) => {

        return {
            position: "absolute",
            top: location.top,
            left: location.left - 22,
            justifyContent: "center",
        };
    };

    useEffect(() => {
        if (storage) {
            getPhotos();
            getPhotoTags()
            getGuesses();
        }
    }, [isFocused]);

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
                    {countPhotos <= 5 && (
                        <TouchableOpacity
                            style={{
                                margin: 12,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={() =>
                                navigation.navigate("UploadEventImagesScreen", {
                                    event: event,
                                    uid: uid,
                                    uploaderName: userName,
                                })
                            }
                        >
                            <Text style={globalStyles.heading3}>
                                Add your photos {countPhotos}
                            </Text>
                            <Ionicons name="add-circle-outline" size={25} />
                        </TouchableOpacity>
                    )}
                    {isSearchText && (
                        <View style={styles.userSearch}>
                            <View style={styles.searchContainer}>
                                {/* <Image
                                    source={require("../../../assets/images/search.png")}
                                    style={styles.searchIconStyle}
                                /> */}
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Search for a User"
                                />
                                {/* <Image
                                    source={require("../../../assets/images/close.png")}
                                    style={styles.closeIconStyle}
                                /> */}
                            </View>
                            <Modal>
                                <ScrollView style={{marginTop: 50}}>
                                    {userList.map((user) => (
                                        <TouchableOpacity
                                            key={user.id}
                                            onPress={() => {
                                                tagUser(user);
                                            }}
                                        >
                                            <View style={styles.userList}>
                                                <Text
                                                    style={styles.userListText}
                                                >
                                                    {user.firstName} {user.lastName}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </Modal>
                        </View>
                    )}
                    <Swiper showsButtons={true}>
                        {eventImages.map((photo, index) => (
                            <View key={index} style={styles.slide1}>
                                <TouchableWithoutFeedback
                                    onPress={(evt) => handlePress(evt, photo)}
                                    disabled={isSearchText}
                                >
                                    <Image
                                        source={{ uri: photo }}
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            margin: 6,
                                            borderRadius: 10,
                                        }}
                                    />
                                </TouchableWithoutFeedback>
                                {tagList.map((item) => (
                        item.imageUrl == photo &&
                        <View key={item.id} style={dynamicStyle(item)}>
                            <View style={styles.tagTriangle}></View>
                            <View style={styles.tagUserView}>
                                <Text style={styles.tagListText}>
                                    {" "}
                                    {item.user}{" "}
                                </Text>
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.removeTagUser}
                                >
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
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
    tagTriangle: {
        height: 0,
        width: 0,
        left: 15,
        borderLeftColor: "transparent",
        borderLeftWidth: 7,
        borderRightColor: "transparent",
        borderRightWidth: 7,
        borderBottomColor: "rgba(0,0,0,.30)",
        borderBottomWidth: 7,
    },
    tagUserView: {
        backgroundColor: "rgba(0,0,0,.30)",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,.30)",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: "row",
    },
    tagListText: {
        color: "white",
        fontWeight: "800",
    },
    removeTagUser: {
        backgroundColor: "white",
        height: 15,
        width: 15,
        marginLeft: 5,
        borderRadius: 15,
    },
    removeIcon: {
        height: 8,
        width: 8,
        marginTop: 3,
        marginLeft: 3.5,
    },
    userSearch: {
        zIndex: 99,
        backgroundColor: "rgba(225,225,225,0.85)",
    },
    userList: {
        padding: 10,
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    userListText: {
        fontWeight: "600",
    },
    searchContainer: {
        flexDirection: "row",
        paddingLeft: 10,
        backgroundColor: "white",
        borderColor: "#999",
        borderWidth: 1,
        width: screenWidth,
        justifyContent: "space-between",
    },
    searchIconStyle: {
        width: 20,
        height: 20,
        marginTop: 10,
        marginLeft: 10,
    },
    closeIconStyle: {
        width: 20,
        height: 20,
        marginTop: 10,
        marginRight: 10,
    },
    textInputStyle: {
        height: 40,
        marginLeft: 10,
        alignItems: "flex-start",
        width: 250,
    },
});
