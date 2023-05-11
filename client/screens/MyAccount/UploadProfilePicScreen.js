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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.uri);
    }
    if (hasGalleryPermission === false) {
      return <Text>No access to images</Text>;
    }
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <Text>PhotoUploadScreen</Text>
      <Button title="Select Image" onPress={() => pickImage()}/>
      {image && <Image source={{uri: image}}/>}
    </SafeAreaView>
  );
};

export default UploadProfilePicScreen;

const styles = StyleSheet.create({});
