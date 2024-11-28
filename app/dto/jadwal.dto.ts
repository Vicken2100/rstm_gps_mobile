import { TYPE_STATUS_JADWAL } from "../constant/status-jadwal.constant";
import { CheckpointResult } from "./checkpoint.dto";
import { BaseResult } from "./commmon.dto";
import { TruckResult } from "./truck.dto";
import { UserResult } from "./user.dto";

export interface JadwalResult extends BaseResult {
  driver: UserResult;
  truck: TruckResult;
  checkpoints: CheckpointResult[];
  tanggal: number;
  customer: string;
  deskripsi: string | null;
  destination: string;
  status: TYPE_STATUS_JADWAL;
}

export interface CreateJadwalPayload {
  truckXid: string;
  driverXid: string;
  tanggal: number;
  deskripsi: string | null;
  customer: string;
  destination: string;
}
