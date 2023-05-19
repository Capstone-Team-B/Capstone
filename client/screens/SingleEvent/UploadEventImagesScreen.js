import {
    StyleSheet,
    Text,
    SafeAreaView,
    Button,
    Image,
    View,
    FlatList,
    Alert,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import globalStyles from "../../utils/globalStyles";
import {
    getStorage,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    metadata,
    ref,
} from "firebase/storage";
import { useNavigation } from "@react-navigation/core";
import { auth } from "../../../firebase";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getDatabase, child, get, query, equalTo, orderByChild, ref as refD } from "firebase/database";

const UploadEventImagesScreen = (params) => {
    const uid = params.route.params.uid;
    const userName = params.route.params.uploaderName;
    const event = params.route.params.event;
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [userId, setUserId] = useState("");
    const navigation = useNavigation();

    // useEffect to get logged-in user approval to access media library
    useEffect(() => {
        const getUserId = async () => {
            const currentUserId = auth.currentUser.uid
            const dbRef = refD(getDatabase());
            const usersQuery = query(
                child(dbRef, 'users'),
                orderByChild('auth_id'),
                equalTo(currentUserId)
            )
            const snapshot = await get (usersQuery);
    
            if (snapshot.exists()) {
                const data = Object.keys(snapshot.val());
                setUserId(data[0])
            }
        }
        getUserId()
    }, []);

    useEffect(() => {
        (async () => {
            const galleryStatus =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === "granted");
        })();
    }, []);

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

    const uploadImages = async () => {
//        COMMENT BACK IN ONCE STORAGE USAGE RESOLVED
        setUploading(true);

        const storage = getStorage();
        const uploadPromises = [];

        for (let i = 0; i < images.length; i++) {
            const filename = images[i].fileName;
            const imageRef = ref(
                storage,
                `event_${event.event_id}/${filename}_${uid}`
                );
                const img = await fetch(images[i].uri);
                const blob = await img.blob();
                const uploadPromise = uploadBytesResumable(imageRef, blob);
                uploadPromises.push(uploadPromise);
            }

            try {
                await Promise.all(uploadPromises);
                console.log("All images uploaded successfully");
            } catch (error) {
                console.log(error);
            }

            setUploading(false);
        setImages([]);
        navigation.navigate("EventGallery", {event, uid, userName});
    };

    const screenWidth = Dimensions.get("window").width;

    return (
        <SafeAreaView style={globalStyles.container}>
            {images.length > 0 ? (
                <View>
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
                            Share your selected photos from {"\n"}
                            {event.name}
                        </Text>
                    </TouchableOpacity>
                    <FlatList
                        data={images}
                        numColumns={2}
                        renderItem={({ item }) => {
                            return (
                                <Image
                                    source={{ uri: item.uri }}
                                    style={{
                                        height: screenWidth / 2 - 12,
                                        width: screenWidth / 2 - 12,
                                        margin: 6,
                                        borderRadius: 10,
                                    }}
                                />
                            );
                        }}
                        keyExtractor={(item, index) => {
                            return index.toString();
                        }}
                    />
                    <TouchableOpacity
                        style={{...globalStyles.button, backgroundColor: "#38b6ff",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 12,
                        }}
                        onPress={pickImage}
                    >
                        <Ionicons name="add-circle-outline" size={25} color={"white"}/>
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
                </View>
            ) : (
                <View
                    style={{
                        ...globalStyles.container,
                        justifyContent: "center",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            ...globalStyles.button,
                            backgroundColor: "#38b6ff",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={pickImage}
                    >
                        <Ionicons name="add-circle-outline" size={55} color={"white"}/>
                        <Text
                            style={{
                                ...globalStyles.heading3,
                                alignSelf: "center",
                                textAlign: "center",
                                color: "white"
                            }}
                        >
                            Add photos from your camera roll to the shared photo gallery
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default UploadEventImagesScreen;

const styles = StyleSheet.create({});

