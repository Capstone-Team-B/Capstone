import * as Notifications from "expo-notifications";

async function registerForPushNotificationsAsync() {
    let token;

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    return token;
}

const AppNavigator = () => {
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);
};

const AppNavigator2 = () => {
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
            expoPushTokensApi.register(token)
        );

        // Works when app is foregrounded, backgrounded, or killed
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log("--- notification tapped ---");
                    console.log(response);
                    console.log("------");
                }
            );

        // Unsubscribe from events
        return () => {
            Notifications.removeNotificationSubscription(
                responseListener.current
            );
        };
    }, []);
};
