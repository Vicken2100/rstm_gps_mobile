import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getListTruckApi } from "../api/truck.api";
import { TruckResult } from "../dto/truck.dto";
import { CreateJadwalPayload } from "../dto/jadwal.dto";
import { DefaultListPayload } from "../dto/commmon.dto";
import { UserResult } from "../dto/user.dto";
import { createJadwal } from "../api/jadwal.api";
import { getListUsersApi } from "../api/users.api";
import { ROLE } from "../constant/role.constant";

export default function AddDeliveryScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    date: new Date(),
    truckName: "",
    truckXid: "",
    destination: "",
    customerName: "",
    driverName: "",
    driverXid: "",
    description: "",
  });

  const [searchTruck, setSearchTruck] = useState("");
  const [searchDriver, setSearchDriver] = useState("");
  const [trucks, setTrucks] = useState<TruckResult[]>([]);
  const [drivers, setDrivers] = useState<UserResult[]>([]);
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [loadingTrucks, setLoadingTrucks] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckResult | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<UserResult | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleSubmit = async () => {
    // Implementasi submit ke API
    try {
      // Submit logic here
      addDelivery();
    } catch (error) {
      console.error(error);
    }
  };

  const searchTrucks = async (query: string) => {
    if (query.length < 2) {
      setTrucks([]);
      return;
    }

    setLoadingTrucks(true);
    try {
      const data = await getListTruckApi({
        ...DefaultListPayload,
        limit: 5,
        filters: {
          name: query,
        },
      });

      if (typeof data === "string") {
        Alert.alert("Error", data);
        return;
      }
      setTrucks(data.items);
    } catch (error) {
      console.error("Error searching trucks:", error);
    } finally {
      setLoadingTrucks(false);
    }
  };

  const searchDrivers = async (query: string) => {
    if (query.length < 2) {
      setDrivers([]);
      return;
    }

    setLoadingDriver(true);
    try {
      const data = await getListUsersApi({
        ...DefaultListPayload,
        limit: 5,
        filters: {
          role: ROLE.DRIVER,
          name: query,
        },
      });

      if (typeof data === "string") {
        Alert.alert("Error", data);
        return;
      }
      setDrivers(data.items);
    } catch (error) {
      console.error("Error searching driver:", error);
    } finally {
      setLoadingDriver(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchTrucks(searchTruck);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTruck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchDrivers(searchDriver);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchDriver]);

  const selectTruck = (truck: TruckResult) => {
    setSelectedTruck(truck);
    setFormData({
      ...formData,
      truckName: truck.nama,
      truckXid: truck.xid,
    });
    setShowTruckModal(false);
    setSearchTruck("");
  };

  const selectDriver = (driver: UserResult) => {
    setSelectedDriver(driver);
    setFormData({
      ...formData,
      driverName: driver.name,
      driverXid: driver.xid,
    });
    setShowDriverModal(false);
    setSearchDriver("");
  };

  const addDelivery = async () => {
    if (!selectedTruck) {
      Alert.alert("Error", "truck harus di isi");
      return;
    }

    if (!selectedDriver) {
      Alert.alert("Error", "driver harus di isi");
      return;
    }

    if (!formData.customerName.trim()) {
      Alert.alert("Error", "customer harus di isi");
      return;
    }

    if (!formData.destination.trim()) {
      Alert.alert("Error", "destination harus di isi");
      return;
    }

    formData.date.setUTCHours(12, 0, 0, 0);

    const epoch = Math.floor(formData.date.getTime() / 1000);

    const payload: CreateJadwalPayload = {
      truckXid: selectedTruck.xid,
      driverXid: selectedDriver.xid,
      tanggal: epoch,
      customer: formData.customerName,
      destination: formData.destination,
      deskripsi: formData.description,
    };

    const result = await createJadwal(payload);

    if (typeof result === "string") {
      Alert.alert("Error", result);
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
        <Text style={styles.headerTitle}>Buat Jadwal</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Date Picker */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formData.date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          {/* Truck Name */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTruckModal(true)}
          >
            <Text
              style={
                selectedTruck ? styles.selectedText : styles.placeholderText
              }
            >
              {selectedTruck ? selectedTruck.nama : "Pilih Truk"}
            </Text>
          </TouchableOpacity>

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
            placeholder="Nama Customer"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={formData.customerName}
            onChangeText={(text) =>
              setFormData({ ...formData, customerName: text })
            }
          />

          {/* Truck Name */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDriverModal(true)}
          >
            <Text
              style={
                selectedDriver ? styles.selectedText : styles.placeholderText
              }
            >
              {selectedDriver ? selectedDriver.name : "Pilih Driver"}
            </Text>
          </TouchableOpacity>

          {/* Description */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Keterangan (Optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={4}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Buat Jadwal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showTruckModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Truk</Text>
              <TouchableOpacity onPress={() => setShowTruckModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Cari truk..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              onChangeText={setSearchTruck}
            />

            {loadingTrucks ? (
              <ActivityIndicator color="#fff" style={styles.loading} />
            ) : (
              <FlatList
                data={trucks}
                keyExtractor={(item) => item.xid}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.truckItem}
                    onPress={() => selectTruck(item)}
                  >
                    <Text style={styles.truckName}>{item.nama}</Text>
                    <Text style={styles.truckPlate}>{item.platNomor}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>
                    {searchTruck.length < 2
                      ? "Ketik minimal 2 karakter untuk mencari"
                      : "Tidak ada truk yang ditemukan"}
                  </Text>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showDriverModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Driver</Text>
              <TouchableOpacity onPress={() => setShowDriverModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Cari driver..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              onChangeText={setSearchDriver}
            />

            {loadingDriver ? (
              <ActivityIndicator color="#fff" style={styles.loading} />
            ) : (
              <FlatList
                data={drivers}
                keyExtractor={(item) => item.xid}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.truckItem}
                    onPress={() => selectDriver(item)}
                  >
                    <Text style={styles.truckName}>{item.name}</Text>
                    <Text style={styles.truckPlate}>{item.xid}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>
                    {searchTruck.length < 2
                      ? "Ketik minimal 2 karakter untuk mencari"
                      : "Tidak ada truk yang ditemukan"}
                  </Text>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
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
