import { StyleSheet } from "react-native";
import React from "react";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 12,
    },
    screenHeader: {
        fontFamily: "Bukhari Script",
        fontSize: 20,
        padding: 20
    },
    heading1: {
        fontSize: 35,
        fontWeight: "bold",
    },
    heading2: {
        fontSize: 20,
        fontWeight: "bold",
    },
    heading3: {
        fontSize: 17,
        fontWeight: "bold",
    },
    paragraph: {
        fontSize: 15,
    },
    tile: {
        margin: 12,
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
    },
    button: {
        padding: 15,
        margin: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 15,
    },
});
