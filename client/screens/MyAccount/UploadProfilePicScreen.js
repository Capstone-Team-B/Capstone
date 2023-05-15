import { StyleSheet, Text, SafeAreaView, Button, Image } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import globalStyles from "../../utils/globalStyles";

const UploadProfilePicScreen = () => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);

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
                aspect: [1, 1],
                quality: 1,
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

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text>PhotoUploadScreen</Text>
            <Button title="Select Image" onPress={() => pickImage()} />
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ height: 100, width: 100, borderRadius: 100 }}
                />
            )}
        </SafeAreaView>
    );
};

export default UploadProfilePicScreen;

const styles = StyleSheet.create({});
