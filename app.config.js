import 'dotenv/config';

export default {
    "expo": {
        "name": "BeThere",
        "slug": "BeThere",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/BeThereConcise.png",
        "userInterfaceStyle": "light",
        "jsEngine": "hermes",
        "splash": {
            "video": "./assets/BeThereAnimation.mp4",
            "resizeMode": "cover",
            "backgroundColor": "#ffffff"
        },
        "assetBundlePatterns": ["**/*"],
        "ios": {
            "supportsTablet": true,
            "bundleIdentifier": "BeThere.app"
        },
        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/BeThereConcise.png",
                "backgroundColor": "#ffffff"
            },
            "package": "BeThere.app",
        },
        "web": {
            "favicon": "./assets/favicon.png"
        },
        "extra": {
            firebaseApiKey: process.env.FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.FIREBASE_APP_ID,
            "eas": {
                "projectId": "59930442-87da-4a40-9d15-1fffd0e7a555"
              }
        },
        "plugins": [
            [
                "expo-contacts",
                {
                    "contactsPermission": "Allow beThere to access your contacts."
                }
            ]
        ],
    }
}
