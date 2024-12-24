import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebaseAuth } from './config';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from @expo/vector-icons

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { icon: 'home', screen: 'Home' , text : 'Home' },
    { icon: 'stats-chart', screen: 'Statistiques' , text : 'Statistics'},
    { icon: 'mail', screen: 'Contact' , text : 'Contact' },
    { icon: 'calendar-outline', screen: 'ItemListScreen' , text : 'Une'},
    { icon: 'images', screen: 'Listimg' , text : 'announcement'}
  ];

  const currentUserEmail = firebaseAuth.currentUser ? firebaseAuth.currentUser.email : '';
  if (currentUserEmail === 'ayman.waidox@gmail.com') {
    menuItems.push({ icon: 'person-add', screen: 'Signup' , text : 'Add admin ' });
    menuItems.push({ icon: 'list', screen: 'AccountList' , text : 'AccountList' });
  }

  return (
    <>
      {isMenuOpen && <View style={styles.darkOverlay} />}
      <View style={styles.menuButton}>
        <TouchableOpacity onPress={toggleMenu}>
          <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>
      {isMenuOpen && (
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate(item.screen);
                toggleMenu();
              }}
            >
              <Ionicons name={item.icon} size={24} color="black" />
              <Text style={styles.menuItemText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.back} onPress={toggleMenu}>
            <Image source={require('../assets/close.png')} style={styles.close} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 0,
  },
 
  menu: {
    position: 'absolute',
    top: 70,
    left: -3,
    width: '70%',
    // height: 600,
    borderRadius: 20,
    backgroundColor: '#D3D3D3',
    padding: 20,
    zIndex: 2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: "white",
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    left:-5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 2, // This is for Android
  }
,  
  menuItemText: {
    fontSize: 15,
    marginHorizontal : 'auto'
    
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  back: {
    position: 'absolute',
    right: -15,
    top: 10,
    transform: [{ translateY: -10 }],
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
  },
  backText: {
    color: 'white',
  },
  close: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    
    
  },
  menuIcon: {
    height: 25,
    width: 25,
  },
});

export default Menu;
