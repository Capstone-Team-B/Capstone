import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Video } from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";

const EmptyState = ({ title, subtitle, nameIcon, iconColor }) => {
    return (
        <View style={styles.container}>
            <View style={styles.containerIcon}>
            <Ionicons name={nameIcon} size={60} color={iconColor}  />
            </View>
            <Text style= {styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

        </View>
    );
};

export default EmptyState;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 26,
        marginVertical:12,
        fontFamily: "Bukhari Script",
    }, 
    subtitle: {
        fontSize:16, 
    },
    containerIcon: {
        padding:24, 
        borderRadius:80, 
        backgroundColor: "#f5f5f5",
    },
    
});
