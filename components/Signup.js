import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { firebaseAuth, db } from './config'; // Assuming you have configured firebaseAuth and db
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth'; // Import necessary functions
import { Ionicons } from '@expo/vector-icons';
import { setDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import Menu from './Menu'; // Import Menu component

export default function Signup({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const auth = firebaseAuth;

    const signup = async () => {
        setLoading(true);
        try {
            // Step 1: Store the current user
            const currentUser = auth.currentUser;

            // Step 2: Create the new user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 3: Store user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                uid: user.uid,
            });

            // Step 4: Sign out the new user
            await signOut(auth);

            // Step 5: Sign in using hardcoded credentials
            await signInWithEmailAndPassword(auth, 'ayman.waidox@gmail.com', 'waid2003');

            setLoading(false);
            setShowSuccessPopup(true);
            navigation.navigate("Home");
        } catch (error) {
            setLoading(false);
            console.log(error);
            setShowErrorPopup(true);
            setTimeout(() => {
                setShowErrorPopup(false);
            }, 2000);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Menu />
            <Image source={require('../assets/login.png')} style={styles.image} />
            <Text style={styles.title}>Ajouter un admin</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="mail" size={24} color="#666" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={24} color="#666" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={signup}>
                <Text style={styles.buttonText}>Ajouter</Text>
            </TouchableOpacity>
            {showSuccessPopup && (
                <View style={styles.popup}>
                    <Text style={styles.popupText}>Sign up successful!</Text>
                </View>
            )}
            {showErrorPopup && (
                <View style={styles.popup}>
                    <Text style={styles.popupText}>Sign up failed. Please try again.</Text>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    image: {
        width: 220,
        height: 265,
        marginBottom: 20,
        marginLeft: 25,
        marginTop: -30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    icon: {
        marginRight: 5,
        height: 47,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#f2f3f7',
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 0.2,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#ff5b5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    popup: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    popupText: {
        color: '#fff',
        fontSize: 16,
    },
});
