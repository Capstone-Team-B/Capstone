import {
    StyleSheet,
    Text,
    SafeAreaView,
    Button,
    Image,
    View,
    FlatList,
    Alert,
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

const UploadEventImagesScreen = (params) => {
    const uid = params.route.params.uid;
    const userName = params.route.params.uploaderName;
    const event = params.route.params.event;
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigation = useNavigation();

    // useEffect to get logged-in user approval to access media library
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
                console.log(imageArray);
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
        // COMMENT BACK IN ONCE STORAGE USAGE RESOLVED
        // setUploading(true);

        // const storage = getStorage();
        // const uploadPromises = [];

        // for (let i = 0; i < images.length; i++) {
        //     const filename = images[i].fileName;
        //     const imageRef = ref(
        //         storage,
        //         `event_${event.event_id}/${filename}_${uid}`
        //         );
        //         const img = await fetch(images[i].uri);
        //         const blob = await img.blob();
        //         const uploadPromise = uploadBytesResumable(imageRef, blob);
        //         uploadPromises.push(uploadPromise);
        //     }

        //     try {
        //         await Promise.all(uploadPromises);
        //         console.log("All images uploaded successfully");
        //     } catch (error) {
        //         console.log(error);
        //     }

        //     setUploading(false);
        setImages([]);
        navigation.navigate("EventGallery");
    };

    return (
        <SafeAreaView
            style={{ ...globalStyles.container, justifyContent: "center" }}
        >
            {images.length > 0 ? (
                <Button
                    title="Upload selected photos"
                    onPress={() => uploadImages()}
                />
            ) : (
                <Button
                    title="Select photos to add to event album"
                    onPress={() => pickImage()}
                />
            )}

            {images.length > 0 ? (
                <FlatList
                    data={images}
                    renderItem={({ item }) => {
                        return (
                            <Image
                                source={{ uri: item.uri }}
                                style={{ height: 200, width: 200 }}
                            />
                        );
                    }}
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }}
                />
            ) : (
                <View
                    styles={{
                        // alignContent: "center",
                        // justifyContent: "center",
                    }}
                >
                    <Text style={{...globalStyles.heading3, alignSelf: "center", textAlign: "center"}}>
                        Share your photos from{"\n"}
                        {event.name}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default UploadEventImagesScreen;

const styles = StyleSheet.create({});

// BELOW CODE WORKS FOR UPLOADING A SINGLE IMAGE
// const uploadImages = async () => {
//     setUploading(true);

//     const storage = getStorage();
//     const filename = images[0].substring(
//         images[0].lastIndexOf("/") + 1
//     );
//     const imageRef = ref(
//         storage,
//         `event_${event.event_id}/${filename}_${uid}`
//     );
//     const response = await fetch(images[0]);
//     const blob = await response.blob();

//     try {
//         await uploadBytes(imageRef, blob, metadata);
//     } catch (error) {
//         console.log(error);
//     }

//     setUploading(false);
//     setImages([]);
// };
