import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { getDetailTruck, updateTruckApi } from "../api/truck.api";
import { TruckResult, UpdateTruck_Payload } from "../dto/truck.dto";
import { STATUS } from "../constant/status.constant";
import { ScrollView } from "react-native-gesture-handler";
import { BASE_URL } from "../api";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditTruckScreen({ navigation, route }: any) {
  const { truckXid } = route.params;
  const [loading, setLoading] = useState(true);
  const [truckData, setTruckData] = useState<TruckResult | null>(null);
  const [maintainanceImage, setMaintainanceImage] = useState<string | null>(
    null
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      // Hanya update jika user menekan "OK"
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedDate) {
      setTime(selectedDate);
    }
  };

  useEffect(() => {
    loadTruckDetail();
  }, []);

  const loadTruckDetail = async () => {
    try {
      const data = await getDetailTruck(truckXid);
      if (typeof data === "string") {
        Alert.alert("Error", data);
        return;
      }
      setTruckData(data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat detail truk");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
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
      setMaintainanceImage(result.assets[0].uri);
    }
  };

  const updateTruck = async () => {
    if (!truckData) {
      Alert.alert("Error", "data harus di isi terlebih dahulu");
      return;
    }

    if (
      truckData.status === STATUS.TIDAK_TERSEDIA &&
      (!time || !date || !maintainanceImage)
    ) {
      Alert.alert("Error", "waktu selesai harus di isi");
      return;
    }

    const payload: UpdateTruck_Payload = {
      deskripsi: truckData.deskripsi,
      status: truckData.status,
      estimasiDone: null,
      version: truckData.version.toString(),
      maintananceImg: null,
    };

    if (truckData.status === STATUS.TIDAK_TERSEDIA) {
      // Buat date baru dengan menggabungkan tanggal dan waktu
      const finalDate = new Date(date!);
      // Set jam dan menit dari time ke finalDate
      finalDate.setHours(time!.getHours());
      finalDate.setMinutes(time!.getMinutes());
      finalDate.setSeconds(0);

      // Konversi ke Unix epoch (dalam detik)
      const unixEpoch = Math.floor(finalDate.getTime() / 1000);

      payload.estimasiDone = unixEpoch.toString();
      payload.maintananceImg = maintainanceImage!;
    }
    setLoading(true);
    const result = await updateTruckApi(truckXid, payload);
    setLoading(false);
    if (typeof result === "string") {
      Alert.alert("Error", result);
      return;
    }

    navigation.goBack();
  };

  if (loading || !truckData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{truckData.nama}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: `${BASE_URL}${truckData.truckImg}` }}
            style={styles.truckImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>
            Plat Kendaran : {truckData.platNomor}
          </Text>

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={truckData.status}
              onValueChange={(value) =>
                setTruckData({ ...truckData, status: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Tersedia" value={STATUS.TERSEDIA} />
              <Picker.Item
                label="Tidak Tersedia"
                value={STATUS.TIDAK_TERSEDIA}
              />
            </Picker>
          </View>

          <Text style={styles.label}>Keterangan</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={truckData.deskripsi}
            onChangeText={(text) =>
              setTruckData({ ...truckData, deskripsi: text })
            }
            multiline
          />

          <Text style={styles.label}>Estimasi Selesai Jam</Text>
          {time ? (
            <>
              <Text style={styles.label}>
                {time.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </>
          ) : (
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeText}>Pilih waktu selesai</Text>
              <Ionicons name="time-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={onChangeTime}
            />
          )}

          <Text style={styles.label}>Estimasi Selesai Hari</Text>
          {date ? (
            <>
              <Text style={styles.label}>
                {date.toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </Text>
            </>
          ) : (
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.timeText}>Pilih waktu selesai</Text>
              <Ionicons name="calendar-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.label}>Foto</Text>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
          >
            {maintainanceImage ? (
              <Image
                source={{ uri: maintainanceImage }}
                style={styles.maintainanceImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.imagePlaceholderText}>Tambahkan foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={updateTruck}
          style={styles.saveButton}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 16, // Extra padding for iOS
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
  imageWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  truckImage: {
    width: "100%",
    height: 200,
  },
  form: {
    flex: 1,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  picker: {
    color: "#fff",
  },
  imagePickerButton: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  maintainanceImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  imagePlaceholderText: {
    color: "#fff",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20, // Tambahan margin bottom
  },
  saveButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
  },
});
