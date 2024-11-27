import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getProfile, updateProfile } from "../api/users.api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    version: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "token tidak ada");
        return;
      }
      const result = await getProfile();

      if (typeof result === "string") {
        Alert.alert("Error", result);
        return;
      }

      setFormData({
        password: "",
        username: result.name,
        version: result.version,
      });
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    if (formData.username.trim() === "" || formData.password.trim() === "") {
      Alert.alert("Error", "Username dan password harus diisi");
      return;
    }

    const result = await updateProfile({
      name: formData.username,
      password: formData.password,
      version: formData.version,
    });
    await AsyncStorage.setItem("username", formData.username);

    if (!result) {
      Alert.alert("Error", "Error saat mengupdate data");
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")} // Pastikan path logo sesuai
            style={styles.logo}
          />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) =>
              setFormData({ ...formData, username: text })
            }
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            secureTextEntry
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Simpan perubahan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff", // Placeholder jika logo belum ada
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  saveButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
});
