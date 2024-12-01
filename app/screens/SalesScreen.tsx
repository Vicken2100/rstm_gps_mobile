import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { getJadwalList } from "../api/jadwal.api";
import { DefaultListPayload } from "../dto/commmon.dto";
import { JadwalResult } from "../dto/jadwal.dto";
import { TYPE_ROLE } from "../constant/role.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SalesScreen({ navigation }: any) {
  const [schedules, setSchedules] = useState<JadwalResult[]>([]);

  const [role, setRole] = useState<TYPE_ROLE | null>(null);
  useEffect(() => {
    const getRole = async () => {
      const role = (await AsyncStorage.getItem("role")) as TYPE_ROLE;

      setRole(role);
    };

    getRole();
  }, []);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const startAt = new Date();
      const endAt = new Date();
      startAt.setUTCHours(0, 0, 1, 0);
      endAt.setUTCHours(23, 59, 59, 999);
      const data = await getJadwalList({
        ...DefaultListPayload,
        showAll: true,
        filters: {
          startAt: Math.floor(startAt.getTime() / 1000),
          endAt: Math.floor(endAt.getTime() / 1000),
        },
      });

      if (typeof data === "string") {
        Alert.alert("Error", data);
        return;
      }
      setSchedules(data.items);
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  };

  const renderScheduleItem = ({ item }: { item: JadwalResult }) => (
    <TouchableOpacity
      style={styles.scheduleItem}
      onPress={() => navigation.navigate("DeliveryDetail", { schedule: item })}
    >
      <View style={styles.scheduleContent}>
        <Text style={styles.driverName}>{item.driver.name}</Text>
        <Text style={styles.destination}>
          {new Date(item.tanggal * 1000).toISOString().split("T")[0]}
        </Text>
        <Text style={styles.destination}> {item.destination}</Text>
        <Text style={styles.destination}> {item.status}</Text>
      </View>
      {role !== "DRIVER" ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddCheckpoint", { schedule: item })
          }
          style={styles.checkButton}
        >
          <Text style={styles.checkButtonText}>Check-Point</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      {/* Header */}
      {role === "ADMIN" ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate("settings")}
              style={styles.headerLeft}
            >
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.headerTitle}>RTSM</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Sub Header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Jadwal Hari Ini</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => navigation.navigate("Riwayat")}
        >
          <Text style={styles.refreshText}>Riwayat</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Schedule List */}
      <FlatList
        data={schedules}
        renderItem={renderScheduleItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {role === "DRIVER" ? (
        <>
          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Perawatan")}
          >
            <Text style={styles.addButtonText}>Perawatan truk</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddDelivery")}
          >
            <Text style={styles.addButtonText}>Tambah Jadwal</Text>
          </TouchableOpacity>
        </>
      )}
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
    justifyContent: "space-between",
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
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  subHeaderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  refreshText: {
    color: "#fff",
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  scheduleItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  scheduleContent: {
    flex: 1,
  },
  driverName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  destination: {
    color: "#fff",
    opacity: 0.8,
  },
  checkButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  checkButtonText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  refreshButton: {
    flexDirection: "row", // Mengatur tata letak horizontal
    alignItems: "center", // Menyelaraskan teks dan ikon secara vertikal
  },
});
