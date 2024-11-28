import { BASE_URL } from ".";
import { CreateUserPayload, UserResult } from "../dto/user.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { List_Payload, ListResult, Responses } from "../dto/commmon.dto";
export const createUsers = async (
  payload: CreateUserPayload
): Promise<boolean> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return false;
  }
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
};

export const getProfile = async (): Promise<UserResult | string> => {
  const token = await AsyncStorage.getItem("userToken");

  if (!token) {
    return "Sesi sudah habis, silahkan login kembali";
  }
  const response = await fetch(`${BASE_URL}/users/profile`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return "Sesi sudah habis, silahkan login kembali";
  }

  const result = (await response.json()) as Responses<UserResult>;

  return result.data;
};

export const updateProfile = async (payload: {
  name: string;
  password: string;
  version: number;
}): Promise<boolean> => {
  const token = await AsyncStorage.getItem("userToken");

  if (!token) {
    return false;
  }

  const response = await fetch(`${BASE_URL}/users/own`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
};

export const getListUsersApi = async (
  payload: List_Payload
): Promise<ListResult<UserResult> | string> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    return "Sesi telah habis, silahkan login kembali";
  }

  const url = new URL(`${BASE_URL}/users`);
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

  const result = (await response.json()) as Responses<ListResult<UserResult>>;

  return result.data;
};
