import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }: any) {
  const [username, setUsername] = useState("Unknown");

  useEffect(() => {
    const setName = async () => {
      const name = await AsyncStorage.getItem("username");
      if(name) {
        setUsername(name);
      }
    }

    setName()
  } , [])

  const menuItems = [
    {
      id: 1,
      title: 'Tracking',
      subtitle: 'Cari lokasi truk',
      icon: 'location',
      color: '#24A957',
    },
    {
      id: 2,
      title: 'Delivery',
      subtitle: 'Status Pesanan',
      icon: 'car',
      color: '#24A957',
    },
    {
      id: 3,
      title: 'Maintenance',
      subtitle: 'Perawatan truk',
      icon: 'construct',
      color: '#24A957',
    },
    {
      id: 4,
      title: 'Truk',
      subtitle: 'Tambah Truk',
      icon: 'bus',
      color: '#24A957',
    },
    {
      id: 5,
      title: "User",
      subtitle: "Tambah User",
      icon: "person",
      color: '#24A957',
    }
  ];
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("settings")} style={styles.headerLeft}>
          <Image
            source={require('../assets/logo.png')}
            
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>RTSM</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* User Greeting */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>Halo {username},</Text>
          <Text style={styles.greetingSubtitle}>Pantau truk anda dengan RTSM</Text>
          
          {/* Map Preview */}
          <View style={styles.mapPreview}>
            <Image
              source={require('../assets/map-preview.jpg')} // Tambahkan gambar preview map
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Layanan Kami</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.title)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#24A957',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40, // Adjust based on status bar height
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  greetingCard: {
    backgroundColor: '#24A957',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greetingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  greetingSubtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  mapPreview: {
    height: 250,
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  menuSection: {
    padding: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#24A957',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});