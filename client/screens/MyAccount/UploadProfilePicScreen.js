// REACT IMPORTS
import {
    StyleSheet,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
// FIREBASE IMPORTS
import {
    getStorage,
    uploadBytesResumable,
    getDownloadURL,
    ref,
    push,
} from "firebase/storage";
import {
    getDatabase,
    ref as refDB,
    update,
    child,
    get,
    query,
    equalTo,
    orderByChild,
} from "firebase/database";
import { auth } from "../../../firebase";
// PROJECT IMPORTS
import globalStyles from "../../utils/globalStyles";

const UploadProfilePicScreen = () => {
    // COMPONENT VARIABLES
    const route = useRoute();
    const { setProfilePic } = route.params.setProfilePic;
    const { user } = route.params.user

    // STATE
    const [userId, setUserId] = useState("");
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigation = useNavigation();

    // USEEFFECTS
    useEffect(() => {
        (async () => {
            const galleryStatus =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === "granted");
        })();
    }, []);

    useEffect(() => {
        const getUserId = async () => {
            const currentUserId = auth.currentUser.uid;
            const dbRef = refDB(getDatabase());
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

    // FUNCTIONS
    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
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

    const uploadProfilePic = async () => {
        // upload the picture to storage
        const storage = getStorage();
        const imageRef = ref(storage, `profilePic/user_${userId}`);
        const img = await fetch(image);
        const blob = await img.blob();
        const uploadPromise = uploadBytesResumable(imageRef, blob);
        try {
            await push(uploadPromise);
            console.log("profile picture uploaded successfully");
        } catch (error) {
            console.log(error);
        }

        // download the imageUrl from storage and add it to the user in realtimeDb
        const url = await getDownloadURL(imageRef);
        const dbRef = getDatabase();
        const userRef = refDB(dbRef, `users/${userId}`);
        const updatedProPic = { profilePic: url };

        try {
            await update(userRef, updatedProPic);
            console.log("profile pic updated");
        } catch (error) {
            console.log(error);
        }

        setImage(null);
        setProfilePic(url)
        navigation.navigate("EditAccountScreen", {user: user});
    };

    return (
        <SafeAreaView style={styles.container}>
            {image ? (
                <View style={styles.justAlign}>
                    <Image
                        source={{ uri: image }}
                        style={{ height: 300, width: 300, borderRadius: 150 }}
                    />
                    <TouchableOpacity
                        style={styles.uploadBtn}
                        onPress={uploadProfilePic}
                    >
                        <Text style={styles.buttonText}>
                            Upload profile picture
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
                    style={styles.selectImageBtn}
                >
                    <Ionicons name="camera-outline" size={55} color="white" />
                    <Text style={styles.selectBtnText}>
                        Tap to select a new profile picture{"\n"}from your
                        camera roll
                    </Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default UploadProfilePicScreen;

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
        justifyContent: "center",
        alignItems: "center",
    },
    justAlign: { justifyContent: "center", alignItems: "center" },
    uploadBtn: {
        ...globalStyles.button,
        backgroundColor: "#cb6cd6",
        flexDirection: "row",
    },
    buttonText: {
        ...globalStyles.paragraph,
        color: "white",
        fontWeight: "bold",
    },
    selectImageBtn: {
        ...globalStyles.button,
        backgroundColor: "#38b6ff",
        justifyContent: "center",
        alignItems: "center",
    },
    selectBtnText: {
        ...globalStyles.heading2,
        textAlign: "center",
        color: "white",
    },
});
