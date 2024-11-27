import { TYPE_STATUS_JADWAL } from "../constant/status-jadwal.constant";

export interface CheckpointResult {
  name: string;
  order: number;
  status: TYPE_STATUS_JADWAL;
}
