import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CreateTruckPayload } from "../dto/truck.dto";
import { createTruck } from "../api/truck.api";

export default function AddTruckScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    truckName: "",
    plateNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [truckImage, setTruckImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddTruck = async () => {
    const errors = [];

    if (!formData.truckName.trim()) {
      errors.push("Nama truk harus diisi");
    }

    if (!formData.plateNumber.trim()) {
      errors.push("Plat nomor harus diisi");
    }

    if (!imageFile) {
      errors.push("Foto truk harus ditambahkan");
    }

    if (errors.length > 0) {
      Alert.alert("Error", errors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      const payload: CreateTruckPayload = {
        nama: formData.truckName,
        platNomor: formData.plateNumber,
        image: truckImage as string,
      };

      const result = await createTruck(payload);

      setLoading(false);

      if (!result) {
        Alert.alert("Error", "Error saat membuat truck");
        return;
      }

      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengunggah gambar");
    }
  };

  const pickImage = async () => {
    // Meminta izin akses galeri
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Error", "Izin akses galeri dibutuhkan!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      try {
        // Fetch gambar dari URI
        const response = await fetch(uri);
        // Konversi ke blob
        const blob = await response.blob();
        // Buat File dari blob
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });

        // Simpan baik URI maupun File
        setTruckImage(uri); // Untuk preview
        setImageFile(file); // Untuk pengiriman ke server
      } catch (error) {
        console.error("Error converting to File:", error);
        Alert.alert("Error", "Gagal memproses gambar");
      }
    }
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
        <Text style={styles.headerTitle}>Pilih Truk</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Nama Truk</Text>
          <TextInput
            style={styles.input}
            placeholder="Cth : Elf"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={formData.truckName}
            onChangeText={(text) =>
              setFormData({ ...formData, truckName: text })
            }
          />

          <Text style={styles.label}>Plat Kendaraan</Text>
          <TextInput
            style={styles.input}
            placeholder="Cth : DB 2100 AU"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={formData.plateNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, plateNumber: text })
            }
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Foto Truk</Text>
          <TouchableOpacity style={styles.photoPlaceholder} onPress={pickImage}>
            {truckImage ? (
              <Image source={{ uri: truckImage }} style={styles.photoPreview} />
            ) : (
              <Text style={styles.photoPlaceholderText}>Tambahkan foto</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton, loading && styles.buttonDisabled]}
            onPress={handleAddTruck}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#FFF" />
            ) : (
              <Text style={styles.addButtonText}>Tambah Truk</Text>
            )}
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
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  photoPlaceholder: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    marginBottom: 20,
  },
  photoPlaceholderText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "white",
  },
  buttonDisabled: {
    backgroundColor: "#9E9E9E",
  },
});
