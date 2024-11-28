import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { JadwalResult } from "../dto/jadwal.dto";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TYPE_ROLE } from "../constant/role.constant";
import {
  cancelJadwalApi,
  doneJadwalApi,
  startJadwalApi,
} from "../api/jadwal.api";
import { STATUS_JADWAL } from "../constant/status-jadwal.constant";

export default function JadwalDetailScreen({ navigation, route }: any) {
  const { schedule } = route.params as { schedule: JadwalResult };
  const [scheduleState, setSceduleState] = useState(schedule);
  const [role, setRole] = useState<TYPE_ROLE | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const getRole = async () => {
      const role = (await AsyncStorage.getItem("role")) as TYPE_ROLE;

      setRole(role);
    };

    getRole();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const startJadwal = async () => {
    setLoading(true);

    const result = await startJadwalApi(scheduleState);

    if (typeof result === "string") {
      Alert.alert("Error", result);
      setLoading(false);
      return;
    }

    setSceduleState({
      ...scheduleState,
      status: STATUS_JADWAL.ONPROGRESS,
      version: scheduleState.version + 1,
    });

    setLoading(false);
  };

  const cancelJadwal = async () => {
    setLoading(true);

    const result = await cancelJadwalApi(scheduleState);

    if (typeof result === "string") {
      Alert.alert("Error", result);
      setLoading(false);
      return;
    }

    setSceduleState({
      ...scheduleState,
      status: STATUS_JADWAL.CANCEL,
      version: scheduleState.version + 1,
    });

    setLoading(false);
  };

  const doneJadwal = async () => {
    setLoading(true);

    const result = await doneJadwalApi(scheduleState);

    if (typeof result === "string") {
      Alert.alert("Error", result);
      setLoading(false);
      return;
    }

    setSceduleState({
      ...scheduleState,
      status: STATUS_JADWAL.DONE,
      version: scheduleState.version + 1,
    });

    setLoading(false);
  };

  if (!role || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Truk {scheduleState.truck.nama}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          {/* Truck Illustration */}
          <View style={styles.imageContainer}>
            <Image
              src={`${BASE_URL}${scheduleState.truck.truckImg}`}
              style={styles.truckImage}
              resizeMode="contain"
            />
          </View>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <DetailItem label="ID" value={scheduleState.xid} />
            <DetailItem
              label="Tanggal"
              value={formatDate(scheduleState.tanggal * 1000)}
            />
            <DetailItem
              label="Plat Kendaraan"
              value={scheduleState.truck.platNomor}
            />
            <DetailItem label="Destinasi" value={scheduleState.destination} />
            <DetailItem label="Nama Customer" value={scheduleState.customer} />
            <DetailItem label="Nama Supir" value={scheduleState.driver.name} />
            <DetailItem
              label="Keterangan"
              value={scheduleState.deskripsi || "-"}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("CheckpointDetail", {
                schedule: scheduleState,
              })
            }
          >
            <Text style={styles.buttonText}>Lihat Titik Pemberhentian</Text>
          </TouchableOpacity>

          {role === "DRIVER" ? (
            <>
              {scheduleState.status === "PENDING" ? (
                <>
                  <TouchableOpacity
                    onPress={() => startJadwal()}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Mulai</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
              {scheduleState.status === "ONPROGRESS" ? (
                <>
                  <TouchableOpacity
                    onPress={() => doneJadwal()}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Selesai</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => cancelJadwal()}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Batalkan</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22C55E", // green-500
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
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  imageContainer: {
    backgroundColor: "#F3F4F6", // gray-100
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  truckImage: {
    width: "75%",
    height: "75%",
  },
  detailsContainer: {
    gap: 16,
  },
  detailItem: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: "#4B5563", // gray-600
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#22C55E", // green-500
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
