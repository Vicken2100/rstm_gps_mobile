import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { ROLE } from '../constant/role.constant';
import { CreateUserPayload } from '../dto/user.dto';
import { createUsers } from '../api/users.api';

export default function AddUserScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    karyawan: '',
    hp: '',
    role: ROLE.DRIVER,
  });


  const roles = [
    { label: 'Admin', value: ROLE.ADMIN },
    { label: 'Sales', value: ROLE.SALES },
    { label: 'Driver', value: ROLE.DRIVER },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      // Validasi form
      if (Object.values(formData).some(value => value.trim() === '')) {
        Alert.alert('Error', 'Semua field harus diisi');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Password tidak cocok');
        return;
      }

      setIsLoading(true);

      const payload: CreateUserPayload = {
        noHP: formData.hp,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        name: formData.karyawan
      }

      // Implementasi API register di sini
      const result = await createUsers(payload);

      if (!result) {
        Alert.alert('Error', 'Terjadi kesalahan saat mendaftar');
        return
      }
      
      // Jika berhasil, kembali ke halaman login
      navigation.goBack();

    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mendaftar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan tombol kembali */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Daftar Di RTSM</Text>
        <Text style={styles.subtitle}>Masukkan username dan password</Text>

        <View style={styles.form}>
          {/* Username */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              value={formData.username}
              onChangeText={(text) => setFormData({...formData, username: text})}
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
              secureTextEntry
            />
          </View>

          {/* Nama Kompany */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nama karyawan</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama karyawan"
              value={formData.karyawan}
              onChangeText={(text) => setFormData({...formData, karyawan: text})}
            />
          </View>

          {/* No HP */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>No HP</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan No HP"
              value={formData.hp}
              onChangeText={(text) => setFormData({...formData, hp: text})}
              keyboardType="phone-pad"
            />
          </View>

          {/* Role */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.role}
                onValueChange={(itemValue) =>
                  setFormData({...formData, role: itemValue})
                }
                style={styles.picker}
              >
                {roles.map((role) => (
                  <Picker.Item 
                    key={role.value} 
                    label={role.label} 
                    value={role.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity 
             style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.registerButtonText}>Daftar</Text>
            )}
          </TouchableOpacity>
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
    paddingTop: 40, // Sesuaikan dengan status bar
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  registerButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});