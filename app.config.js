import 'dotenv/config';

export default {
    "expo": {
        "name": "BeThere",
        "slug": "BeThere",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/BeThereConcise.png",
        "userInterfaceStyle": "light",
        "splash": {
            "video": "./assets/BeThereAnimation.mp4",
            "resizeMode": "cover",
            "backgroundColor": "#ffffff"
        },
        "assetBundlePatterns": ["**/*"],
        "ios": {
            "supportsTablet": true
        },
        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/BeThereConcise.png",
                "backgroundColor": "#ffffff"
            }
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
            firebaseAppId: process.env.FIREBASE_APP_ID
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
