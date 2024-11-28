import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { JadwalResult } from "../dto/jadwal.dto";
import { Ionicons } from "@expo/vector-icons";
import { TYPE_ROLE } from "../constant/role.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckpointResult } from "../dto/checkpoint.dto";
import { Alert } from "react-native";
import { STATUS_JADWAL } from "../constant/status-jadwal.constant";
import { doneCheckpointApi } from "../api/checkpoint.api";

const CheckpointScreen = ({ navigation, route }: any) => {
  const { schedule } = route.params as { schedule: JadwalResult };
  const [role, setRole] = useState<TYPE_ROLE | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkpoints, setCheckpoint] = useState<CheckpointResult[]>(
    [...schedule.checkpoints].sort((a, b) => a.order + b.order)
  );

  useEffect(() => {
    const getRole = async () => {
      const role = (await AsyncStorage.getItem("role")) as TYPE_ROLE;

      setRole(role);
    };

    getRole();
  }, []);

  const doneCheckpoint = async (item: CheckpointResult) => {
    setLoading(true);

    const result = await doneCheckpointApi(item);

    if (typeof result === "string") {
      Alert.alert("Error", result);
      setLoading(false);
      return;
    }

    setCheckpoint((prevCheckpoints) =>
      prevCheckpoints.map((cp) => {
        if (cp.xid === item.xid) {
          return {
            ...cp,
            status: STATUS_JADWAL.DONE,
          };
        }
        return cp;
      })
    );

    setLoading(false);
  };

  const getIconForCheckpoint = (order: number) => {
    switch (order) {
      case 1:
        return <Ionicons name="car-outline" size={24} color="white" />;
      case 2:
        return <Ionicons name="business-outline" size={24} color="white" />;
      case 3:
        return <Ionicons name="location-outline" size={24} color="white" />;
      case 4:
        return <Ionicons name="home-outline" size={24} color="white" />;
      default:
        return <Ionicons name="location-outline" size={24} color="white" />;
    }
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
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`Truck ${schedule.truck.nama}`}</Text>
      </View>

      <Text style={styles.progressTitle}>Progress</Text>

      {/* Checkpoints */}
      <View style={styles.checkpointsContainer}>
        {checkpoints.map((checkpoint, index) => (
          <View key={index} style={styles.checkpointRow}>
            {/* Icon Circle */}
            <View style={styles.iconCircle}>{getIconForCheckpoint(2)}</View>

            {/* Connecting Line */}
            {/* {index !== checkpoints.length - 1 && (
              <View style={styles.connectingLine} />
            )} */}
            <View style={styles.connectingLine} />

            {/* Checkpoint Details */}
            <View style={styles.checkpointDetails}>
              <Text style={styles.checkpointName}>{checkpoint.name}</Text>
              <Text style={styles.checkpointLocation}>
                {`Lokasi ke-${index + 1}`}
              </Text>

              {/* Status Check */}
              {checkpoint.status !== "DONE" && role !== "DRIVER" && (
                <TouchableOpacity
                  style={styles.checkContainer}
                  onPress={() => doneCheckpoint(checkpoint)}
                >
                  <Ionicons name="checkmark-outline" size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        <View style={styles.checkpointRow}>
          {/* Icon Circle */}
          <View style={styles.iconCircle}>{getIconForCheckpoint(3)}</View>

          {/* Checkpoint Details */}
          <View style={styles.checkpointDetails}>
            <Text style={styles.checkpointName}>{schedule.destination}</Text>
            <Text style={styles.checkpointLocation}>
              {`Pemberhentian Terahkir`}
            </Text>
          </View>
        </View>
      </View>
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
  progressTitle: {
    fontSize: 16,
    color: "white",
    marginLeft: 16,
    marginTop: 8,
  },
  checkpointsContainer: {
    padding: 16,
    flex: 1,
  },
  checkpointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  connectingLine: {
    position: "absolute",
    left: 24,
    top: 48,
    width: 2,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  checkpointDetails: {
    marginLeft: 12,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkpointName: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  checkpointLocation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CheckpointScreen;
