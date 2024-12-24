import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal, Image, ActivityIndicator, Alert } from 'react-native';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from './config'; // Ensure this is correctly configured
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import Menu from './Menu';

const Listimg = () => {
  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageInstance = getStorage();
        const imageRefs = await listAll(ref(storageInstance, '/'));
        const urls = await Promise.all(imageRefs.items.map(item => getDownloadURL(item)));
        setImages(urls);
      } catch (error) {
        console.error("Error fetching images: ", error);
        Alert.alert("Error", "Failed to fetch images. Please try again later.");
      }
    };
    fetchImages();
  }, []);

  const handleDeleteImage = async (url) => {
    try {
      const storageInstance = getStorage();
      const imageRef = ref(storageInstance, url);
      await deleteObject(imageRef);
      setImages(images.filter(image => image !== url));
    } catch (error) {
      console.error("Error deleting image: ", error);
      Alert.alert("Error", "Failed to delete image. Please try again later.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
      setIsModalVisible(true);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "No image selected.");
      return;
    }

    setUploading(true);

    try {
      const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
      const mimeType = mime.getType(selectedImage);
      console.log("Selected image filename:", filename);
      console.log("MIME type:", mimeType);

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function() {
          console.error("Failed to fetch blob");
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', selectedImage, true);
        xhr.send(null);
      });

      const storageRef = ref(storage, `/${filename}`);
      await uploadBytes(storageRef, blob, { contentType: mimeType });
      blob.close(); // Close the blob

      const downloadURL = await getDownloadURL(storageRef);
      setImages([...images, downloadURL]);
      setUploading(false);
      Alert.alert("Done");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image. Please try again later.");
      setUploading(false);
    }

    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleDeleteImage(item)} style={styles.deleteButton}>
          <Ionicons name="trash" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredImages = images.filter(image => image.includes(searchText));

  return (
    <View style={styles.container}>
      <Menu />
      {/* <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
      /> */}
      <View style={styles.searc}>
      <FlatList
        data={filteredImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      </View>
      <TouchableOpacity onPress={pickImage} style={styles.addButton}>
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
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
              <Text style={styles.imagePickerText}>Pick an image</Text>
            </TouchableOpacity>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={uploadImage}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Save</Text>
                )}
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
  searchInput: {
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 80,
  },
  searc : {
    marginTop : 90
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#ff3300',
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#009688',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: 350,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  imagePickerButton: {
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
  },
  imagePickerText: {
    color: '#333',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
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
    backgroundColor: '#666',
  },
  modalSaveButton: {
    backgroundColor: '#009688',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Listimg;
