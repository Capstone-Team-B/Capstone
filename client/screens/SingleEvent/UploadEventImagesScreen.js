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

const UploadEventImagesScreen = (params) => {
    const uid = params.route.params.uid;
    const userName = params.route.params.uploaderName;
    const event = params.route.params.event;
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

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
                    imageArray.push(image.uri);
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

    //     console.log("images -->", images);
    //     console.log("imageRef -->", imageRef);
    //     console.log("response -->", response);

    //     try {
    //         await uploadBytes(imageRef, blob, metadata);
    //     } catch (error) {
    //         console.log(error);
    //     }

    //     setUploading(false);
    //     setImages([]);
    // };

    const uploadImages = async () => {
        setUploading(true);
    
        const storage = getStorage();
        const uploadPromises = [];
    
        for (let i = 0; i < images.length; i++) {
            const filename = images[i].substring(
                images[i].lastIndexOf("/") + 1
            );
            const imageRef = ref(
                storage,
                `event_${event.event_id}/${filename}_${uid}`
            );
            const response = await fetch(images[i]);
            const blob = await response.blob();    
            const uploadPromise = uploadBytes(imageRef, blob);
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
    };


    return (
        <SafeAreaView style={globalStyles.container}>
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
                                source={{ uri: item }}
                                style={{ height: 200, width: 200 }}
                            />
                        );
                    }}
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }}
                />
            ) : (
                <View>
                    <Text>Share your pohtos from {event.name}!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default UploadEventImagesScreen;

const styles = StyleSheet.create({});
