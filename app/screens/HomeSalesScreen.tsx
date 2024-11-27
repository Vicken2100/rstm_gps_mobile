import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeSalesScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang di RTSM</Text>
      <Text style={styles.subtitle}>Ini adalah halaman home</Text>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});