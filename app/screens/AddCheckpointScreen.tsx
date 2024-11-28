import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createCheckpoint } from "../api/checkpoint.api";
import { CreateCheckpoint_Payload } from "../dto/checkpoint.dto";
import { JadwalResult } from "../dto/jadwal.dto";

export default function AddCheckpointScreen({ navigation, route }: any) {
  const [formData, setFormData] = useState({
    destination: "",
    order: 1,
  });

  const { schedule } = route.params as { schedule: JadwalResult };

  const handleSubmit = async () => {
    // Implementasi submit ke API
    try {
      if (!formData.destination) {
        Alert.alert("Error", "Destination harus di isi");
        return;
      }

      if (formData.order <= 0) {
        Alert.alert("Error", "Urutan harus lebih dari 0");
        return;
      }

      const payload: CreateCheckpoint_Payload = {
        jadwalXid: schedule.xid,
        name: formData.destination,
        order: formData.order,
      };

      const result = await createCheckpoint(payload);

      if (typeof result === "string") {
        Alert.alert("Error", result);
        return;
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
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
        <Text style={styles.headerTitle}>
          Buat Pemberhentian menuju {schedule.destination}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Destination */}
          <TextInput
            style={styles.input}
            placeholder="Destinasi"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={formData.destination}
            onChangeText={(text) =>
              setFormData({ ...formData, destination: text })
            }
          />

          {/* Customer Name */}
          <TextInput
            style={styles.input}
            placeholder="Urutan"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={formData.order.toString()}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                order: isNaN(Number(text)) ? 0 : Number(text),
              })
            }
            keyboardType="numeric"
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              Buat Lokasi Pemberhentian
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 16,
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#4CAF50",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  truckItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  truckName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  truckPlate: {
    color: "#fff",
    opacity: 0.8,
    marginTop: 4,
  },
  loading: {
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    padding: 20,
  },
  selectedText: {
    color: "#fff",
    fontSize: 16,
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
  },
});
