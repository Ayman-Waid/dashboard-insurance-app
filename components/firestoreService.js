import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from './config';

// Get all items
export const getItems = async () => {
  const q = query(collection(db, "une"));
  const querySnapshot = await getDocs(q);
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
};

// Add a new item
export const addItem = async (item) => {
  await addDoc(collection(db, "une"), item);
};

// Update an item
export const updateItem = async (id, updatedItem) => {
  const itemRef = doc(db, "une", id);
  await updateDoc(itemRef, updatedItem);
};

// Delete an item
export const deleteItem = async (id) => {
  await deleteDoc(doc(db, "une", id));
};

// Search items by field
export const searchItems = async (field, value) => {
  const q = query(collection(db, "une"), where(field, "==", value));
  const querySnapshot = await getDocs(q);
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
};
