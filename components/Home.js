import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, Modal } from 'react-native'; // Import Modal here
import { db, firebaseAuth } from './config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';
import Menu from './Menu'; // Import Menu component

const Home = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [filterType, setFilterType] = useState('alphabetic');

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'allusers'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'allusers', userId));
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setExpandedUserId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert('Error', 'Failed to delete user.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const filterUsers = () => {
    const filteredUsers = users.filter(user => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (user.nom && user.nom.toLowerCase().includes(searchLower)) ||
        (user.prenom && user.prenom.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.tel && user.tel.toLowerCase().includes(searchLower))
      );
    });

    if (filterType === 'alphabetic') {
      return filteredUsers.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (filterType === 'date') {
      return filteredUsers.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      return filteredUsers;
    }
  };

  const toggleExpand = (userId) => {
    setExpandedUserId(prevUserId => (prevUserId === userId ? null : userId));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View style={styles.containerr}>
            <Menu />
          </View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Users</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.actionButton}>
                <FontAwesome name="filter" size={20} color="white" />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity onPress={handleSignOut} style={styles.signout}>
                <FontAwesome name="sign-out" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.scrollView}>
            {filterUsers().map((user, index) => (
              <View key={index} style={styles.card}>
                <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand(user.id)}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>{user.nom} {user.prenom}</Text>
                      <Text style={styles.cardSubtitle}>{user.email}</Text>
                    </View>
                    <FontAwesome
                      name={expandedUserId === user.id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#2C3E50"
                    />
                  </View>
                </TouchableOpacity>
                {expandedUserId === user.id && (
                  <View style={styles.cardDetails}>
                    <Text>Email  {user.email}</Text>
                    <Text>Tel  {user.tel}</Text>
                    <TouchableOpacity onPress={() => deleteUser(user.id)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Users</Text>
            <TouchableOpacity onPress={() => { setFilterType('alphabetic'); setFilterModalVisible(false) }} style={styles.filterOption}>
              <Text style={styles.filterOptionText}>Alphabetic</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFilterType('date'); setFilterModalVisible(false) }} style={styles.filterOption}>
              <Text style={styles.filterOptionText}>Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerr: {
    backgroundColor: '#F4F6F9',
    zIndex: 10
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#3498DB', // White background for a card-like appearance
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: 30,
    height: 180,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderRadius : 10,
    borderColor: '#E0E0E0', // Light gray border
},


  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#2C3E50',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  signout: {
    padding: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    marginLeft: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: '#ffff',
    flex: 1,
  },
  scrollView: {
    marginBottom: 10,
  },
  card: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'column',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginHorizontal : 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  cardDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    paddingVertical : -5,
    paddingHorizontal : -15
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2C3E50',
  },
  filterOption: {
    padding: 10,
    alignItems: 'center',
  },
  filterOptionText: {
    fontSize: 18,
    color: '#3498DB',
  },
});

export default Home;
