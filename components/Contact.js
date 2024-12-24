import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';
import Menu from './Menu';
const Contact = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const onSubmit = async () => {
    if (!email ||!name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      await send(
        'service_ivz2zxp',
        'template_wy8gwe4',
        {
          name,
          email,
          message: 'This is a static message',
        },
        {
          publicKey: 's6cne5FpojWd9cHC3',
        },
      );

      Alert.alert('Success', 'Email sent successfully!');
      setEmail("");
      setName("");
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log('EmailJS Request Failed...', err);
      }

      Alert.alert('Error', 'Failed to send email.');
      console.log('ERROR', err);
    }
  };

  return (
      <View style={styles.container}>
        <Menu/>
      <Text style={styles.title}>Contact Us</Text>
      <View style={styles.ligne}></View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={name}
        onChangeText={setName}
        autoFocus={true}
      />
      <TextInput
        style={styles.messageInput}
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholder="Message"
        value={email}
        onChangeText={setEmail}
      />
     
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop : 10,
    left: -100,
  },
  ligne: {
    height: 3,
    width: '25%',
    backgroundColor: '#FF3D54',
    left: 60,
    borderRadius: 50,
    marginTop: -5,
    marginBottom: 50,
    left : -122,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageInput: {
    width: '100%',
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Contact;
