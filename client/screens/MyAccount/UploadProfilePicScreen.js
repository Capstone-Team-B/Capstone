import {
    StyleSheet,
    Text,
    SafeAreaView,
    Button,
    Image,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import globalStyles from "../../utils/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";

const UploadProfilePicScreen = (props) => {
    const uid = props.route.params.uid;
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
                        style={{ height: 300, width: 300, borderRadius: 150 }}
                    />
                    <Ionicons name="cloud-upload-outline" size={55} />
                    <Text style={globalStyles.heading2}>Upload profile picture</Text>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => pickImage()}
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Ionicons name="camera-outline" size={55} />
                    <Text
                        style={{
                            ...globalStyles.heading2,
                            textAlign: "center",
                        }}
                    >
                        Tap to select a new profile picture{"\n"}from your
                        camera roll
                    </Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default UploadProfilePicScreen;

const styles = StyleSheet.create({});
