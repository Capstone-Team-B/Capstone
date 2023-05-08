import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const RegisterScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.navigate("Home")
            }
        })

        return unsubscribe
    }, [])

    // const handleSignUp = () => {
    //     auth
    //         .createUserWithEmailAndPassword(email, password)
    //         .then(userCredentials => {
    //             const user = userCredentials.user;
    //             console.log('Registered with: ', user.email);
    //         })
    //         .catch(error => alert(error.message))
    // }

    const handleSignUp = () => {
        // Check if the email entered during registration already exists in the database
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const existingUser = Object.keys(data).find(key => data[key].email === email);
                if (existingUser) {
                // Update the existing user's information in the database
                update(ref(dbRef, `users/${existingUser}`), {
                    password: password,
                }).then(() => {
                    console.log("User information updated successfully");
                }).catch((error) => {
                    console.error(error);
                });
                } else {
                // Create a new record for the new user in the database
                auth.createUserWithEmailAndPassword(email, password)
                    .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log('Registered with: ', user.email);
                    const uid = user.uid;
                    // Store the user data in the Realtime Database with the UID as the key
                    set(ref(dbRef, `users/${uid}`), {
                        email: email,
                        password: password,
                    }).then(() => {
                        console.log("New user created successfully");
                    }).catch((error) => {
                        console.error(error);
                    });
                    })
                    .catch(error => alert(error.message));
                }
            } else {
                // Create a new record for the new user in the database
                auth.createUserWithEmailAndPassword(email, password)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log('Registered with: ', user.email);
                    const uid = user.uid;
                    // Store the user data in the Realtime Database with the UID as the key
                    set(ref(dbRef, `users/${uid}`), {
                    email: email,
                    password: password,
                    // Other user data fields...
                    }).then(() => {
                    console.log("New user created successfully");
                    }).catch((error) => {
                    console.error(error);
                    });
                })
                .catch(error => alert(error.message));
            }
        }).catch((error) => {
          console.error(error);
        });
    };
      
      

    const handleLogin = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with: ', user.email);
            })
            .catch(error => alert(error.message))
    }

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
        <View style={styles.inputContainer}>
            <TextInput
            placeholder='Email'
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            />
             <TextInput
            placeholder='Password'
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
            />
            
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
            >
                <Text style={styles.buttonText}>
                    Login
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, styles.buttonOutline]}
            >
                <Text style={styles.buttonOutlineText}>
                    Register
                </Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
})