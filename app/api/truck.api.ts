import {
  CreateTruckPayload,
  TruckResult,
  UpdateTruck_Payload,
} from "../dto/truck.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from ".";
import {
  DefaultListPayload,
  List_Payload,
  ListResult,
  Responses,
} from "../dto/commmon.dto";

export const createTruck = async (
  payload: CreateTruckPayload
): Promise<boolean> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return false;
  }

  const formData = new FormData();

  // Tambahkan data payload ke FormData
  formData.append("nama", payload.nama); // Nama truk
  formData.append("platNomor", payload.platNomor); // Plat nomor
  formData.append("image", {
    uri: payload.image,
    name: "photo.png",
    filename: "imageName.png",
    type: "image/png",
  } as any);

  const response = await fetch(`${BASE_URL}/truck`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  return response.ok;
};

export const getListTruck = async (): Promise<
  ListResult<TruckResult> | string
> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const url = new URL(`${BASE_URL}/truck`);
  const params: { [key: string]: unknown } = { showAll: true };

  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, String(params[key]));
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return "Terjadi kesalahan pada server";
  }

  const result = (await response.json()) as Responses<ListResult<TruckResult>>;

  return result.data;
};

export const getListTruckApi = async (
  payload: List_Payload = DefaultListPayload
): Promise<ListResult<TruckResult> | string> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const url = new URL(`${BASE_URL}/truck`);
  const params = payload as Record<string, any>;

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

  const result = (await response.json()) as Responses<ListResult<TruckResult>>;

  return result.data;
};

export const getDetailTruck = async (
  xid: string
): Promise<TruckResult | string> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const response = await fetch(`${BASE_URL}/truck/${xid}/detail`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return "Terjadi kesalahan pada server";
  }

  const result = (await response.json()) as Responses<TruckResult>;

  return result.data;
};

export const updateTruckApi = async (
  xid: string,
  payload: UpdateTruck_Payload
): Promise<string | true> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const formData = new FormData();
  formData.append("status", payload.status);
  formData.append("deskripsi", payload.deskripsi);
  formData.append("version", payload.version);

  if (payload.maintananceImg) {
    formData.append("image", {
      uri: payload.maintananceImg,
      name: "photo.png",
      filename: "imageName.png",
      type: "image/png",
    } as any);
  }

  if (payload.estimasiDone) {
    formData.append("estimasiDone", payload.estimasiDone);
  }

  const response = await fetch(`${BASE_URL}/truck/${xid}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": payload.maintananceImg
        ? "multipart/form-data"
        : "application/json",
    },
    body: payload.maintananceImg
      ? formData
      : JSON.stringify({
          status: payload.status,
          estimasiDone: null,
          deskripsi: payload.deskripsi,
          version: payload.version,
        }),
  });

  if (!response.ok) {
    return "Terjadi kesalahan pada server";
  }

  return true;
};
