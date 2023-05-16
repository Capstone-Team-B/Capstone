import { StyleSheet, Dimensions, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import GallerySwiper from "react-native-gallery-swiper";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SwipeGallery = (params) => {
    const photoIndex = params.route.params.photoIndex;
    const allPhotos = params.route.params.allPhotos;
    const [photoObjects, setPhotoObjects] = useState(null);

    useEffect(() => {
        const allPhotoObjects = allPhotos.map((photo) => ({
            uri: photo,
            dimensions: {
                width: screenWidth-24,
                height: screenHeight-24,
            },
        }));
        setPhotoObjects(allPhotoObjects);
        console.log(allPhotoObjects)
    }, []);

    return (
        <GallerySwiper
            images={photoObjects}
            initialPage={photoIndex}
            sensitiveScroll={false}
        />
    );
};

export default SwipeGallery;

const styles = StyleSheet.create({});
