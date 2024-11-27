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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { STATUS } from "../constant/status.constant";
import { getDetailTruck } from "../api/truck.api";
import { TruckResult } from "../dto/truck.dto";
import { BASE_URL } from "../api";
export default function TruckDetailScreen({ navigation, route }: any) {
  const { truckXid } = route.params;
  const [truck, setTruck] = useState<TruckResult | null>(null);
  const [loading, setLoading] = useState(true);

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
      setTruck(data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat detail truk");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!truck) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Data tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>{truck.nama}</Text>
      </View>

      {/* Sample Truck Image in white container */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: `${BASE_URL}${truck.truckImg}` }}
          style={styles.truckImage}
          resizeMode="contain"
        />
      </View>

      {/* Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Plat Kendaraan :
            <Text style={styles.infoValue}> {truck.platNomor}</Text>{" "}
          </Text>
          <View style={styles.statusWrapper}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusIndicator}>
              <View
                style={
                  truck.status === STATUS.TERSEDIA
                    ? styles.greenDot
                    : styles.redDot
                }
              />
              <Text style={styles.statusText}>
                {truck.status === STATUS.TERSEDIA
                  ? "Tersedia"
                  : "Tidak tersedia"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Keterangan</Text>
          {truck.estimasiDone ? (
            <View style={styles.timeWrapper}>
              <Text style={styles.infoLabel}>Tanggal Mulai</Text>
            </View>
          ) : (
            <></>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoValue}>{truck.deskripsi}</Text>
          {truck.estimasiDone ? (
            <Text style={styles.infoValue}>
              {new Date(truck.updatedAt * 1000).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          ) : (
            <></>
          )}
        </View>

        {truck.estimasiDone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimasi</Text>
            <Text style={styles.infoValue}>
              {new Date(truck.estimasiDone * 1000).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}
        {truck.maintanaceImg && (
          <View style={styles.photoSection}>
            <Text style={styles.infoLabel}>Foto</Text>

            <Image
              source={{ uri: `${BASE_URL}${truck.maintanaceImg}` }}
              style={styles.maintenanceImage}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditTruck", { truckXid })}
      >
        <Text style={styles.editButtonText}>Edit Truk</Text>
      </TouchableOpacity>
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
  imageWrapper: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  truckImage: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoLabel: {
    color: "#fff",
    fontSize: 16,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusWrapper: {
    alignItems: "flex-end",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginRight: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00e043",
    marginRight: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
  },
  timeWrapper: {
    alignItems: "flex-end",
  },
  photoSection: {
    marginTop: 16,
  },
  maintenanceImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
  },
});
