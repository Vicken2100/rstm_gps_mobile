import { BASE_URL } from ".";
import {
  DefaultListPayload,
  List_Payload,
  ListResult,
  Responses,
} from "../dto/commmon.dto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateJadwalPayload, JadwalResult } from "../dto/jadwal.dto";

export const getJadwalList = async (
  payload: List_Payload = DefaultListPayload
): Promise<ListResult<JadwalResult> | string> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }
  const params = payload as Record<string, any>;
  const url = new URL(`${BASE_URL}/jadwal`);
  for (const key in payload) {
    if (
      params[key] &&
      typeof params[key] === "object" &&
      !Array.isArray(params[key])
    ) {
      for (const subKey in params[key]) {
        url.searchParams.append(
          `${key}[${subKey}]`,
          String(params[key][subKey])
        );
      }
    } else {
      url.searchParams.append(key, String(params[key]));
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return "Terjadi kesalahan pada server";
  }

  const result = (await response.json()) as Responses<ListResult<JadwalResult>>;

  return result.data;
};

export const createJadwal = async (
  payload: CreateJadwalPayload
): Promise<true | string> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const response = await fetch(`${BASE_URL}/jadwal`, {
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

export const startJadwalApi = async (payload: JadwalResult) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const response = await fetch(`${BASE_URL}/jadwal/${payload.xid}/onprogress`, {
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

export const cancelJadwalApi = async (payload: JadwalResult) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const response = await fetch(`${BASE_URL}/jadwal/${payload.xid}/cancel`, {
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

export const doneJadwalApi = async (payload: JadwalResult) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const response = await fetch(`${BASE_URL}/jadwal/${payload.xid}/done`, {
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
