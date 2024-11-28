import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getJadwalList } from "../api/jadwal.api";
import { STATUS_JADWAL } from "../constant/status-jadwal.constant";
import { List_Payload } from "../dto/commmon.dto";
import { JadwalResult } from "../dto/jadwal.dto";

interface RiwayatScreenProps {
  navigation: any;
}

const RiwayatScreen: React.FC<RiwayatScreenProps> = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState("berlanggung");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [schedules, setSchedules] = useState<JadwalResult[]>([]);
  const [loading, setLoading] = useState(false);

  const months = [
    { label: "Januari", value: "1" },
    { label: "Februari", value: "2" },
    { label: "Maret", value: "3" },
    { label: "April", value: "4" },
    { label: "Mei", value: "5" },
    { label: "Juni", value: "6" },
    { label: "Juli", value: "7" },
    { label: "Agustus", value: "8" },
    { label: "September", value: "9" },
    { label: "Oktober", value: "10" },
    { label: "November", value: "11" },
    { label: "Desember", value: "12" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => ({
    label: (new Date().getFullYear() - i).toString(),
    value: (new Date().getFullYear() - i).toString(),
  }));

  const getMonthEpochs = (month: string, year: string) => {
    // Buat tanggal pertama bulan yang dipilih jam 1 pagi
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      1,
      1,
      0,
      0,
      0
    );

    // Dapatkan tanggal terakhir bulan yang dipilih
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    // Set ke tanggal terakhir jam 23 pagi
    const endDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      lastDay,
      23,
      0,
      0,
      0
    );

    return {
      startEpoch: Math.ceil(startDate.getTime() / 1000),
      endEpoch: Math.ceil(endDate.getTime() / 1000),
    };
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const payload: List_Payload = {
        skip: 0,
        limit: 10,
        sortBy: "createdAt-desc",
        showAll: true,
        filters: {},
      };

      if (selectedMonth && selectedYear) {
        const filter = getMonthEpochs(selectedMonth, selectedYear);
        payload.filters.startAt = filter.startEpoch;
        payload.filters.endAt = filter.endEpoch;
      }

      if (selectedStatus === "berlanggung") {
        payload.filters.status = STATUS_JADWAL.ONPROGRESS;
      } else {
        payload.filters.notStatus = STATUS_JADWAL.ONPROGRESS;
      }

      // Replace with your actual API call
      const response = await getJadwalList(payload);
      if (typeof response === "string") {
        Alert.alert("Error", response);
        return;
      }
      setSchedules(response.items);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [selectedStatus, selectedMonth, selectedYear]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat</Text>
      </View>

      {/* Status Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedStatus === "berlanggung" && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedStatus("berlanggung")}
        >
          <Text
            style={[
              styles.toggleText,
              selectedStatus === "berlanggung" && styles.toggleTextActive,
            ]}
          >
            Berlangsung
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedStatus === "selesai" && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedStatus("selesai")}
        >
          <Text
            style={[
              styles.toggleText,
              selectedStatus === "selesai" && styles.toggleTextActive,
            ]}
          >
            Selesai
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Rows */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}
              style={styles.picker}
            >
              {months.map((month) => (
                <Picker.Item
                  key={month.value}
                  label={month.label}
                  value={month.value}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}
              style={styles.picker}
            >
              {years.map((year) => (
                <Picker.Item
                  key={year.value}
                  label={year.label}
                  value={year.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Schedule List */}
      <ScrollView style={styles.scheduleList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          schedules.map((schedule) => (
            <TouchableOpacity
              key={schedule.xid}
              style={styles.scheduleCard}
              onPress={() =>
                navigation.navigate("ScheduleDetail", { schedule })
              }
            >
              <View style={styles.scheduleHeader}>
                <Text style={styles.scheduleTitle}>
                  Truk {schedule.truck.nama}
                </Text>
                <Text style={styles.scheduleDate}>
                  {
                    new Date(schedule.tanggal * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                </Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleStatusLabel}>Status: </Text>
                <Text style={styles.scheduleStatus}>{schedule.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22C55E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  toggleContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
  },
  toggleText: {
    color: "#22C55E",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "white",
  },
  filterContainer: {
    padding: 16,
    gap: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 16,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    height: 40, // Tambahkan height yang fixed
    justifyContent: "center", // Untuk memposisikan konten di tengah vertikal
  },
  picker: {
    height: 40,
    color: "#000", // Pastikan text berwarna hitam
    // Untuk Android, tambahkan padding
    paddingHorizontal: 10,
  },
  scheduleList: {
    flex: 1,
    padding: 16,
  },
  scheduleCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  scheduleDate: {
    color: "#666",
  },
  scheduleDetails: {
    flexDirection: "row",
  },
  scheduleStatusLabel: {
    color: "#666",
  },
  scheduleStatus: {
    fontWeight: "500",
  },
  loadingText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RiwayatScreen;
