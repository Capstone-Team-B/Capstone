// REACT IMPORTS
import React, { useEffect, useState } from "react";
import {
    Button,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/core";
import Ionicons from "react-native-vector-icons/Ionicons";
// EXPO IMPORTS
import * as ImagePicker from "expo-image-picker";
// FIREBASE IMPORTS
import {
    child,
    equalTo,
    get,
    getDatabase,
    orderByChild,
    push,
    query,
    ref as refD,
    set,
} from "firebase/database";
import {
    getDownloadURL,
    getStorage,
    listAll,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { auth } from "../../../firebase";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const UploadEventImagesScreen = (params) => {
    // COMPONENT VARIABLES
    const navigation = useNavigation();
    const storage = getStorage();

    // PROPS & PARAMS
    const uid = params.route.params.uid;
    const userName = params.route.params.uploaderName;
    const event = params.route.params.event;

    // STATE
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [userId, setUserId] = useState("");
    const [eventImages, setEventImages] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [cordinates, setCordinates] = useState({ top: 0, left: 0 });
    const [imageSelected, setImageSelected] = useState("");
    const [isSearchText, setIsSearchText] = useState(false);
    const [userList, setUserList] = useState([]);

    // USEEFFECTS
    useEffect(() => {
        // useEffect to get logged-in user approval to access media library
        const getUserId = async () => {
            const currentUserId = auth.currentUser.uid;
            const dbRef = refD(getDatabase());
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
    }, []);

    useEffect(() => {
        (async () => {
            const galleryStatus =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === "granted");
        })();
    }, []);

    useEffect(() => {
        if (params.route.params?.event) {
            getPhotos();
            getGuesses();
            getPhotoTags();
        }
    }, [params.route.params]);

    // FUNCTIONS
    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets) {
                let imageArray = [];
                result.assets.forEach((image) => {
                    imageArray.push(image);
                });
                setImages(imageArray);
            }

            if (hasGalleryPermission === false) {
                return <Text>No access to images</Text>;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getGuesses = async () => {
        try {
            const dbRef = refD(getDatabase());
            await get(
                query(child(dbRef, `events/${event.event_id}/guestList`))
            ).then(async (guestIdsData) => {
                if (guestIdsData.exists()) {
                    const data = guestIdsData.val();
                    const guestIds = Object.keys(data);

                    let guests = [];

                    for (let index = 0; index < guestIds.length; index++) {
                        const guestId = guestIds[index];
                        await get(query(child(dbRef, `users/${guestId}`))).then(
                            (guestUsers) => {
                                if (guestUsers.exists()) {
                                    const data = guestUsers.val();
                                    guests.push(data);
                                } else {
                                    console.log("no guests in this event");
                                }
                            }
                        );
                    }
                    setUserList(guests);
                } else {
                    console.log("no guests in this event");
                }
            });
        } catch (error) {
            console.error("err", error);
        }
    };

    const uploadImages = async () => {
        setUploading(true);

        const uploadPromises = [];

        for (let i = 0; i < images.length; i++) {
            const filename = images[i].fileName;
            const imageRef = ref(
                storage,
                `event_${event.event_id}/${filename}_${uid}_${Math.floor(
                    Math.random() * 100000
                )}`
            );
            const img = await fetch(images[i].uri);
            const blob = await img.blob();
            const uploadPromise = uploadBytesResumable(imageRef, blob);
            uploadPromises.push(uploadPromise);
        }

        try {
            await Promise.all(uploadPromises);
            getPhotos();
            console.log("All images uploaded successfully");
        } catch (error) {
            console.log(error);
        }

        setUploading(false);
        setImages([]);
    };

    const getPhotos = async () => {
        let imageURLs = [];
        const listRef = ref(storage, `event_${event.event_id}`);
        listAll(listRef)
            .then((res) => {
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

    const screenWidth = Dimensions.get("window").width;

    //Tags

    const getPhotoTags = async () => {
        const dbRef = refD(getDatabase());
        try {
            await get(
                query(
                    child(dbRef, `photoTags`),
                    orderByChild("event_id"),
                    equalTo(event.event_id)
                )
            ).then(async (photoTagsData) => {
                if (photoTagsData.exists()) {
                    const data = photoTagsData.val();
                    const tags = Object.keys(data).map((key) => ({
                        ...data[key],
                    }));
                    console.info("tags", tags);
                    setTagList(tags);
                } else {
                    console.log("no tags in this event");
                }
            });
        } catch (error) {
            console.error("err", error);
        }
    };

    const handlePress = (evt, photo) => {
        let top = evt.nativeEvent.locationY;
        let left = evt.nativeEvent.locationX;

        setIsSearchText(true);
        setCordinates({ top, left });
        setImageSelected(photo);
    };

    const tagUser = async (guest) => {
        const dbRef = refD(getDatabase());
        let newTag = {
            event_id: event.event_id,
            imageUrl: imageSelected,
            top: cordinates.top,
            left: cordinates.left,
            user: guest.firstName,
        };

        try {
            await set(push(child(dbRef, `photoTags`)), newTag);
            setTagList(tagList.concat([newTag]));
        } catch (error) {
            console.error("tag", error);
        }
        setIsSearchText(false);
    };

    const dynamicStyle = (location) => {
        return {
            position: "absolute",
            top: location.top,
            left: location.left - 22,
        };
    };

    return (
        <SafeAreaView style={{...globalStyles.container, backgroundColor: "black"}}>
            {eventImages.length > 0 && images.length === 0 && (
                <Swiper style={{ position: "relative", backgroundColor: "black" }} showsButtons={true}>
                    {eventImages.map((photo, index) => (
                        <>
                            <View key={index} style={styles.slide1}>
                                <TouchableWithoutFeedback
                                    onPress={(evt) => handlePress(evt, photo)}
                                    disabled={false}
                                >
                                    <Image
                                        source={{ uri: photo }}
                                        style={{
                                            width: screenWidth,
                                            aspectRatio: 1,
                                            margin: 6,
                                            // borderRadius: 10,
                                        }}
                                    />
                                </TouchableWithoutFeedback>
                                {tagList.map(
                                    (item) =>
                                        item.imageUrl == photo && (
                                            <View
                                                key={item.id}
                                                style={dynamicStyle(item)}
                                            >
                                                <View
                                                    style={styles.tagTriangle}
                                                ></View>
                                                <View
                                                    style={styles.tagUserView}
                                                >
                                                    <Text
                                                        style={
                                                            styles.tagListText
                                                        }
                                                    >
                                                        {" "}
                                                        {item.user}{" "}
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                )}
                            </View>
                        </>
                    ))}
                </Swiper>
            )}

            {images.length > 0 && (
                <View>
                    <FlatList
                        data={images}
                        numColumns={2}
                        renderItem={({ item }) => {
                            return (
                                <>
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={{
                                            height: screenWidth / 2 - 12,
                                            width: screenWidth / 2 - 12,
                                            margin: 6,
                                            borderRadius: 10,
                                        }}
                                    />
                                </>
                            );
                        }}
                        keyExtractor={(item, index) => {
                            return index.toString();
                        }}
                    />
                    <View >

                    <TouchableOpacity
                        style={{
                            ...globalStyles.button,
                            backgroundColor: "#38b6ff",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 12,
                        }}
                        onPress={pickImage}
                        >
                        <Ionicons
                            name="add-circle-outline"
                            size={25}
                            color={"white"}
                            />
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                fontWeight: "bold",
                                color: "white",
                                alignSelf: "center",
                                textAlign: "center",
                            }}
                            >
                            Edit your photo selection
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            ...globalStyles.button,
                            backgroundColor: "#cb6ce6",
                        }}
                        onPress={uploadImages}
                        >
                        <Ionicons
                            name="cloud-upload-outline"
                            color={"white"}
                            size={25}
                            />
                        <Text
                            style={{
                                ...globalStyles.heading3,
                                alignSelf: "center",
                                textAlign: "center",
                                color: "white",
                            }}
                            >
                            Share selected photos from {"\n"}
                            {event.name}
                        </Text>
                    </TouchableOpacity>
                            </View>
                </View>
            )}
            {images.length == 0 && eventImages.length <= 5 && (
                <View
                    style={{
                        justifyContent: "center",
                        backgroundColor: "black",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            ...globalStyles.button,
                            padding: 8,
                            backgroundColor: "#38b6ff",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={pickImage}
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={35}
                            color={"white"}
                        />
                        <Text
                            style={{ ...globalStyles.heading3, color: "white" }}
                        >
                            Add photos to shared album
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            {isSearchText && (
                <Modal visible={isSearchText}>
                    <ScrollView style={{ marginTop: 50 }}>
                        {userList.map((user) => (
                            <TouchableOpacity
                                key={user.id}
                                onPress={() => {
                                    tagUser(user);
                                }}
                            >
                                <View style={styles.userList}>
                                    <Text style={styles.userListText}>
                                        {user.firstName} {user.lastName}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <Button
                            title="Close"
                            onPress={() => setIsSearchText(false)}
                        ></Button>
                    </ScrollView>
                </Modal>
            )}
        </SafeAreaView>
    );
};

export default UploadEventImagesScreen;

const styles = StyleSheet.create({
    slide1: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        position: "relative",
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
});
