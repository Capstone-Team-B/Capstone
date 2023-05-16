import { Dimensions, StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import React from "react";
import globalStyles from "../../utils/globalStyles";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SinglePhoto = (params) => {
    const photo = params.route.params.photo;
    console.log(photo)

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={{ margin: 12, alignItems: "center", justifyContent: "center", flex: 1, borderRadius: 10, overflow: "hidden", backgroundColor: "white",}}>
            <Image
                source={{ uri: photo }}
                style={{
                    resizeMode: "contain",
                    width: "100%",
                    height: "100%",
                    borderRadius: 10
                }}
                />
                </View>
        </SafeAreaView>
    );
};

export default SinglePhoto;

const styles = StyleSheet.create({});
