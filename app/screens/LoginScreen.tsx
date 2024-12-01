import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { login } from "../api/auth.api";
import { AuthPayload } from "../dto/auth.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const netInfo = useNetInfo();

  const handleLogin = async () => {
    setLoading(true);
    // Contoh validasi sederhana
    if (username.trim() === "" || password.trim() === "") {
      setLoading(false);
      Alert.alert("Error", "Username dan password harus diisi");
      return;
    }

    const payload: AuthPayload = {
      username: username.trim(),
      password: password.trim(),
    };

    const result = await login(payload);

    if (typeof result === "string") {
      setLoading(false);
      Alert.alert("Error", result);
      return;
    }

    await AsyncStorage.setItem("userToken", result.token);
    await AsyncStorage.setItem("username", result.name);
    await AsyncStorage.setItem("role", result.role);

    if (result.role === "ADMIN") {
      navigation.replace("HomeAdmin");
    } else {
      navigation.replace("Penjadwalan");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        <View>
          <Text>Type: {netInfo.type}</Text>
          {/* <Text>Is Connected? {netInfo.isConnected?.toString()}</Text> */}
        </View>

        <Text style={styles.title}>Masuk Di RTSM</Text>
        <Text style={styles.subtitle}>Masukkan username dan password</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Masuk</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#4CAF50", // Warna hijau sesuai gambar
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButtonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
