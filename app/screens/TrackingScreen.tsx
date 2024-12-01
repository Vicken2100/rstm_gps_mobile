import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";
import { BASE_URL } from "../api";

// Type definition for the location payload
type UpdateLocation_Payload = {
  xid: string;
  latitude: number;
  longitude: number;
  battery: number;
};

// Type for our marker state
type MarkerData = UpdateLocation_Payload & {
  lastUpdate: Date;
};

const MapScreen = ({ navigation }: any) => {
  // State to store all active markers
  const [markers, setMarkers] = useState<Record<string, MarkerData>>({});

  // Initial region centered on North Sulawesi (Manado area)
  const initialRegion = {
    latitude: 1.4748, // Manado's latitude
    longitude: 124.8421, // Manado's longitude
    latitudeDelta: 1.5, // Zoom level to show most of North Sulawesi
    longitudeDelta: 1.5, // Adjusted for aspect ratio
  };

  useEffect(() => {
    // Initialize socket connection
    const socket = io(`${BASE_URL}/truck`);

    // Connection event handler
    socket.on("connect", () => {
      Alert.alert("Info", "Successfully connected to tracking server");
    });

    // Disconnection event handler
    socket.on("disconnect", () => {
      Alert.alert("Error", "Disconnected");
    });

    // Connection error handler
    socket.on("connect_error", (error) => {
      Alert.alert("Error", "Connection Error");
    });

    // Listen for location updates
    socket.on("updateLocation", (payload: UpdateLocation_Payload) => {
      setMarkers((prevMarkers) => ({
        ...prevMarkers,
        [payload.xid]: {
          ...payload,
          lastUpdate: new Date(),
        },
      }));
    });

    // Cleanup socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Custom marker component with battery indicator
  const CustomMarker = ({ marker }: { marker: MarkerData }) => {
    // Determine battery color based on level
    const getBatteryColor = (level: number) => {
      if (level > 70) return "#4CAF50";
      if (level > 30) return "#FFC107";
      return "#F44336";
    };

    return (
      <View style={styles.markerContainer}>
        <View
          style={[
            styles.battery,
            { backgroundColor: getBatteryColor(marker.battery) },
          ]}
        >
          <View style={styles.batteryLevel}>
            <View
              style={[
                styles.batteryFill,
                {
                  width: `${marker.battery}%`,
                  backgroundColor: getBatteryColor(marker.battery),
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.marker} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
      >
        {Object.values(markers).map((marker) => (
          <Marker
            key={marker.xid}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={`Device ID: ${marker.xid}`}
            description={`Battery: ${marker.battery}%`}
          >
            <CustomMarker marker={marker} />
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "white",
  },
  battery: {
    width: 30,
    height: 14,
    borderRadius: 3,
    marginBottom: 4,
    padding: 2,
    backgroundColor: "white",
  },
  batteryLevel: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 1,
  },
  batteryFill: {
    height: "100%",
    borderRadius: 1,
  },
});

// Custom map style to match the light theme
const mapStyle = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#e9e9e9",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
];

export default MapScreen;
