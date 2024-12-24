import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { firebaseAuth } from './config'; // Assume firebaseAuth is configured
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function Login({ navigation }) {
    const [email, setEmail] = useState("abah@gmail.com");
    const [password, setPassword] = useState("abah");
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const auth = firebaseAuth;

    const signin = () => {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setLoading(false);
                setShowSuccessPopup(true);
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    navigation.navigate('Home');
                }, 1500);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
                setShowErrorPopup(true);
                setTimeout(() => {
                    setShowErrorPopup(false);
                }, 2000);
            });
    };

    const resetPassword = () => {
        if (!email) {
            Alert.alert("Reset Password Failed", "Please enter your email address.");
            return;
        }
        setLoading(true);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setLoading(false);
                Alert.alert("Reset Password", "Password reset email sent.");
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
                Alert.alert("Reset Password Failed", error.message);
            });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Image source={require('../assets/login.png')} style={styles.image} />
            <Text style={styles.title}>Log in</Text>
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
            <TouchableOpacity style={styles.button} onPress={signin}>
                <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetPassword}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            {showSuccessPopup && (
                <View style={styles.popup}>
                    <Text style={styles.popupText}>Sign in successful!</Text>
                </View>
            )}
            {showErrorPopup && (
                <View style={styles.popup}>
                    <Text style={styles.popupText}>Incorrect email or password.</Text>
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
        borderWidth:0.2
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
    forgotPassword: {
        color: '#333',
        textDecorationLine: 'underline',
        marginTop: 10,
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
