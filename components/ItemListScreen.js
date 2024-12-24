import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { Ionicons } from '@expo/vector-icons';
import Menu from './Menu';

const ItemListScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentId, setCurrentId] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const uneCollection = collection(db, 'une');
        const uneSnapshot = await getDocs(uneCollection);
        const uneList = uneSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            date: data.date.toDate(), // Convert Firestore Timestamp to Date
          };
        });
        setDocuments(uneList);
        setFilteredDocuments(uneList);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    setFilteredDocuments(
      documents.filter(doc =>
        doc.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, documents]);

  const handleAddItem = async () => {
    try {
      const docRef = await addDoc(collection(db, 'une'), {
        title: currentTitle,
        date: Timestamp.fromDate(currentDate),
      });
      const newDocument = { id: docRef.id, title: currentTitle, date: currentDate };
      setDocuments([...documents, newDocument]);
      setFilteredDocuments([...filteredDocuments, newDocument]);
      setCurrentTitle('');
      setCurrentContent('');
      setCurrentDate(new Date());
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'une', id));
      setDocuments(documents.filter(item => item.id !== id));
      setFilteredDocuments(filteredDocuments.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const docRef = doc(db, 'une', currentId);
      await updateDoc(docRef, {
        title: currentTitle,
        date: Timestamp.fromDate(currentDate),
      });
      const updatedDocuments = documents.map(item =>
        item.id === currentId ? { id: currentId, title: currentTitle, date: currentDate } : item
      );
      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      setCurrentId(null);
      setCurrentTitle('');
      setCurrentContent('');
      setCurrentDate(new Date());
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const openModal = (mode, item = {}) => {
    setModalMode(mode);
    if (mode === 'edit') {
      setCurrentId(item.id);
      setCurrentTitle(item.title);
      setCurrentDate(new Date(item.date));
    } else {
      setCurrentTitle('');
      setCurrentContent('');
      setCurrentDate(new Date());
    }
    setIsModalVisible(true);
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setIsDatePickerVisible(false);
    setCurrentDate(currentDate);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}> {item.title}</Text>
      <Text>Date: {item.date.toLocaleDateString()}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => openModal('edit', item)} style={styles.editButton}>
          <Ionicons name="pencil" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Menu />
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredDocuments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity onPress={() => openModal('add')} style={styles.addButton}>
        <Ionicons name="add" size={36} color="white" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
          <TextInput
              style={styles.inputadd}
              placeholder="Title"
              value={currentTitle}
              onChangeText={setCurrentTitle}
              multiline={true}
              textAlignVertical="top"
            />
            {/* <TextInput
              style={styles.input}
              placeholder="Content"
              value={currentContent}
              onChangeText={setCurrentContent}
            /> */}
            <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{currentDate.toDateString()}</Text>
            </TouchableOpacity>
            {isDatePickerVisible && (
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={modalMode === 'add' ? handleAddItem : handleUpdateItem}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa', 
  },
 
  header: {
    padding: 20,
    backgroundColor: '#333',  // Dark background for header
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',  // White text color
  },
  item: {
    backgroundColor: '#fff',  // White background for items
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',  // Light border for items
    borderWidth: 1,
    borderColor: '#ddd', 
     // Light border for items
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',  // Dark text color
    marginBottom: 5,
  },
  searchInput: {
    height: 50,
    borderColor: '#888',  // Grey border for input
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 80,

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 20,
    maxHeight: 50,
    maxWidth : '30%',
    marginLeft: 190,
  },
  editButton: {
    backgroundColor: '#ffcc00',  // Yellow color for edit button
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff3300',  // Red color for delete button
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  addButton: {
    backgroundColor: '#009688',  // Teal color for add button
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    bottom: 30,
    right: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Semi-transparent black background
  },
  modalView: {
    width: 350,
    backgroundColor: '#fff',  // White background for modal
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#888',  // Grey border for input
    borderWidth: 1,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#fff',  // White background for input
  },
  datePickerButton: {
    height: 50,
    borderColor: '#888',  // Grey border for date picker button
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',  
  },
  datePickerText: {
    color: '#333', 
    padding : 10 
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  modalCancelButton: {
    backgroundColor: '#666',  // Grey background for cancel button
  },
  modalSaveButton: {
    backgroundColor: '#009688',  // Teal background for save button
  },
  modalButtonText: {
    color: '#fff',  // White text color for buttons
    fontWeight: 'bold',
  },
  inputadd: {
    height: 100,
    borderColor: '#888',  // Grey border for input add
    borderWidth: 1,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#fff',  // White background for input add
  },
});

export default ItemListScreen;
