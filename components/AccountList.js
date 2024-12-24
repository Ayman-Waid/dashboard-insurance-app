import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import { FontAwesome } from '@expo/vector-icons';
import Menu from './Menu'; // Import Menu component


export default function AccountInfo({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id, // Add id field for keyExtractor
                }));
                setUsers(usersList);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        try {
            await deleteDoc(doc(db, 'users', id));
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error(error);
            Alert.alert("Delete Failed", "Failed to delete user.");
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete this account?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => deleteUser(id),
                    style: "destructive"
                }
            ]
        );
    };


    const renderItem = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.userText}> {item.email}</Text>
            <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
                <FontAwesome name="trash" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
        
    }

    return (
        <View style = {styles.main}>
        <View style = {styles.menu}>
            {/* <Menu /> */}
            </View>
        <View style={styles.container}>
            
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id} // Use id as the key
            />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        width : '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        marginTop: -50,
        top : 50, 
        width : '110%',
        right : 19,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        width : '98%',
        marginHorizontal : 5
    },
    userText: {
        fontSize: 16,
        color: '#333',
    },
    deleteButton: {
        backgroundColor: '#ff5b5b',
        padding: 5,
        borderRadius: 5,
    },
    
});
