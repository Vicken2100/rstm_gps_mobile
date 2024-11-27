import { TYPE_STATUS } from "../constant/status.constant";
import { BaseResult } from "./commmon.dto";

export interface CreateTruckPayload {
  nama: string;
  platNomor: string;
  image: string;
}

export interface TruckResult extends BaseResult {
  nama: string;
  platNomor: string;
  deskripsi: string;
  status: TYPE_STATUS;
  estimasiDone: number | null;
  truckImg: string;
  maintanaceImg: string | null;
}

export type UpdateTruck_Payload = {
  status: TYPE_STATUS;
  estimasiDone: string | null;
  deskripsi: string;
  version: string;
  maintananceImg: string | null;
};
