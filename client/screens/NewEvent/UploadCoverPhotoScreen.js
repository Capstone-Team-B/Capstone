import {
    StyleSheet,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    View, Dimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import globalStyles from "../../utils/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
    getStorage,
    uploadBytesResumable,
    getDownloadURL,
    ref,
    push,
} from "firebase/storage";
import { getDatabase, ref as refDB, update } from "firebase/database";
import { useNavigation } from "@react-navigation/core";

const screenWidth = Dimensions.get("window").width;


const UploadCoverPhotoScreen = (params) => {
    const event = params.route.params.event
    console.log("event -->", event)
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigation = useNavigation();

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
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 0.2,
            });
            console.log(result);
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
            if (hasGalleryPermission === false) {
                return <Text>No access to images</Text>;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const uploadCoverPhoto = async () => {
        // upload the picture to storage
        const storage = getStorage();
        const imageRef = ref(storage, `coverPhoto/event_${event.event_id}`);
        const img = await fetch(image);
        // console.log("img -->", img);
        const blob = await img.blob();
        const uploadPromise = uploadBytesResumable(imageRef, blob);
        try {
            await push(uploadPromise);
            console.log("cover photo uploaded successfully");
        } catch (error) {
            console.log(error);
        }

        // download the imageUrl from storage and add it to the user in realtimeDb
        const url = await getDownloadURL(imageRef);
        const dbRef = getDatabase();
        const eventRef = refDB(dbRef, `events/${event.event_id}`);
        const newCoverPhoto = { eventPhoto: url };

        try {
            await update(eventRef, newCoverPhoto);
            console.log("cover photo updated")
        } catch (error) {
            console.log(error)
        }

        setImage(null);
        navigation.goBack()
    };

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {image ? (
                <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Image
                        source={{ uri: image }}
                        style={{ height: 300, width: screenWidth}}
                    />
                    <TouchableOpacity
                        style={{
                            ...globalStyles.button,
                            backgroundColor: "#cb6cd6",
                            flexDirection: "row",
                        }}
                        onPress={uploadCoverPhoto}
                    >
                        <Text
                            style={{
                                ...globalStyles.paragraph,
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            Upload cover photo
                        </Text>
                        <Ionicons
                            name="cloud-upload-outline"
                            size={25}
                            color="white"
                            paddingLeft={10}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => pickImage()}
                    style={{
                        ...globalStyles.button,
                        backgroundColor: "#38b6ff",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="camera-outline" size={55} color="white" />
                    <Text
                        style={{
                            ...globalStyles.heading2,
                            textAlign: "center",
                            color: "white",
                        }}
                    >
                        Tap to select an event cover photo{"\n"}from your
                        camera roll
                    </Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default UploadCoverPhotoScreen;

const styles = StyleSheet.create({});
