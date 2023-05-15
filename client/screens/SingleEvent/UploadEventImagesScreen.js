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
// import { getDatabase, child, get, query } from "firebase/database";
// import { ref } from "firebase";
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
    const event = params.route.params.event;
    const [userName, setUserName] = useState({});
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    // useEffect to get all logged-in user info to pass along with image upload
    // useEffect(() => {
    //     const dbRef = ref(getDatabase());
    //     get(child(dbRef, `users/${uid}`))
    //         .then((snapshot) => {
    //             if (snapshot.exists()) {
    //                 console.log(
    //                     "this is the data from the database -->",
    //                     snapshot.val()
    //                 );
    //                 setUserName(
    //                     `${snapshot.val().firstName} ${snapshot.val().lastName}`
    //                 );
    //             } else {
    //                 console.log("No data available");
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);

    // useEffect to get loggin-in user approval to access media library
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
                    const imageObject = {
                        uri: image.uri,
                        uploadDate: Date.now(),
                        uploader_id: uid,
                        event_id: event.event_id,
                    };
                    imageArray.push(imageObject);
                });
                setImages(imageArray);
                console.log(imageArray);
            }

            if (hasGalleryPermission === false) {
                return <Text>No access to images</Text>;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const uploadImages = async () => {
        setUploading(true);

        const storage = getStorage();
        try {
            for (let i = 0; i < images.length; i++) {
                const filename = images[i].uri.substring(
                    images[i].uri.lastIndexOf("/") + 1
                );
                const imageRef = ref(
                    storage,
                    `event_${images[i].event_id}/${filename}_${uid}`
                );
                const response = await fetch(images[i].uri);
                const blob = await response.blob();
                // const customMetadata = {
                //     metadata: {
                //         uploadDate: images[i].uploadDate,
                //         uploader_id: images[i].uploader_id,
                //         event_id: images[i].event_id,
                //     },
                // };
                await uploadBytes(
                    imageRef,
                    blob,
                    // customMetadata
                );
            }
            setUploading(false);
            Alert.alert(
                "Succes! Your photos have been uploaded to the shared album."
            );
            setImages([]);
        } catch (error) {
            console.log(error);
        }
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
                <View>
                    <Text>Share your pohtos from {event.name}!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default UploadEventImagesScreen;

const styles = StyleSheet.create({});
