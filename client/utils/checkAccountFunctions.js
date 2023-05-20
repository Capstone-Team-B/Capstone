import {
    getDatabase,
    ref,
    child,
    get,
    query,
    orderByChild,
    equalTo,
} from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native/types";
const navigation = useNavigation();

export const isThereSnapshot = (snapshot) => {
    console.log("snapshot ", snapshot);
    if (snapshot.exists()) {
        const userRef = snapshot.val();
        const uid = Object.keys(userRef)[0];
        Alert.alert("Your Host made an account. Let's update it.");
        navigation.navigate("CreateAccountScreen", {
            uid: uid,
        });
        return;
    }
};

export const findEmail = (dbRef, email) => {
    if (email === "") {
        return;
    }
    try {
        get(
            query(child(dbRef, "users"), orderByChild("email"), equalTo(email))
        ).then(isThereSnapshot(snapshot));
    } catch (error) {}
};

export const findPhoneNumber = (dbRef, phoneNumber) => {
    if (phoneNumber === "") {
        return;
    }
    try {
        get(
            query(
                child(dbRef, "users"),
                orderByChild("phoneNumber"),
                equalTo(phoneNumber)
            )
        ).then(isThereSnapshot(snapshot));
    } catch (error) {
        error.message = "Phone number issue";
        console.log(error);
    }
};

export const handleSubmit = async () => {
    //Make sure phone or email is entered to look up
    console.log("submit clicked");
    if (phoneNumber === "" && email === "") {
        Alert.alert(`Please provide an email or phone number`);
        return;
    }
    const dbRef = ref(getDatabase());
    try {
        findPhoneNumber(dbRef, phoneNumber);
    } catch (error) {
        error.message = "Phone Number issue in submit";
        console.log(error);
    }
    try {
        findEmail(dbRef, email);
    } catch (error) {
        error.message = "email issue in submit";
        console.log(error);
    }
    Alert.alert("No matching account. Let's create one");
    navigation.navigate("CreateAccountScreen", {
        uid: "",
    });
    return;
};

export const handleSkip = async () => {
    navigation.navigate("CreateAccountScreen", { uid: "" });
};

export default checkFunctions;
