import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { getDatabase, ref, child, get } from "firebase/database";

const AllUsers = () => {
    const [users, setUsers] = useState([]);

    const dbRef = ref(getDatabase());
    get(child(dbRef, `users`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const userList = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setUsers(userList);
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error(error);
        });

    return (
        <View style={styles.container}>
            {users.map((user) => (
                <View key={user.id} style={styles.item}>
                    <Text style={styles.firstName}>{user.firstName}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    item: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    firstName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
    },
});

export default AllUsers;
