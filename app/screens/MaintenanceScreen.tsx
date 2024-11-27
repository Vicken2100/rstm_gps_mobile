import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TruckResult } from "../dto/truck.dto";
import { getListTruck } from "../api/truck.api";

export default function MaintenanceScreen({ navigation }: any) {
  const [loading, setLoading] = React.useState(true);
  const [truckData, setTruckData] = React.useState<TruckResult[]>([]);
  const renderTruckItem = ({ item }: { item: TruckResult }) => (
    <TouchableOpacity
      style={styles.truckCard}
      onPress={() => navigation.navigate("TruckDetail", { truckXid: item.xid })}
    >
      <Text style={styles.truckName}>{item.nama}</Text>
      <Text style={styles.plateNumber}>{item.platNomor}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchListTruck = async () => {
      const result = await getListTruck();
      setLoading(false);
      if (typeof result === "string") {
        Alert.alert("Error", result);
        return;
      }

      setTruckData(result.items);
    };
    fetchListTruck();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pilih Truk</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={truckData}
          renderItem={renderTruckItem}
          keyExtractor={(item) => item.xid}
          contentContainerStyle={styles.listContainer}
        />
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
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  listContainer: {
    padding: 16,
  },
  truckCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  truckName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  plateNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
});
