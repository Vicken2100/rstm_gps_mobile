import { BASE_URL } from ".";
import {
  CheckpointResult,
  CreateCheckpoint_Payload,
} from "../dto/checkpoint.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createCheckpoint = async (payload: CreateCheckpoint_Payload) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const response = await fetch(`${BASE_URL}/checkpoint`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return "Terjadi kesalahan saat mengisi data";
  }

  return true;
};

export const doneCheckpointApi = async (payload: CheckpointResult) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const response = await fetch(`${BASE_URL}/checkpoint/${payload.xid}/done`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ version: payload.version }),
  });

  if (!response.ok) {
    return "Terjadi kesalahan saat mengupdate data";
  }

  return true;
};
