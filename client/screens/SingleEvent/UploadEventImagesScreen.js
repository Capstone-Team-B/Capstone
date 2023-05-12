import {
    StyleSheet,
    Text,
    SafeAreaView,
    Button,
    Image,
    FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import globalStyles from "../../utils/globalStyles";

const UploadEventImagesScreen = () => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [images, setImages] = useState(null);

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

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text>UploadEventImagesScreen</Text>
            <Button title="Select Image" onPress={() => pickImage()} />
            {images && (
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
            )}
            {images && <Button title="Upload selected images" />}
        </SafeAreaView>
    );
};

export default UploadEventImagesScreen;

const styles = StyleSheet.create({});
