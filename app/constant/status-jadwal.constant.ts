export const STATUS_JADWAL = {
    PENDING: "PENDING",
    ONPROGRESS: "ONPROGRESS",
    DONE: "DONE",
    CANCEL: "CANCEL",
} as const;

export type TYPE_STATUS_JADWAL = (typeof STATUS_JADWAL)[keyof typeof STATUS_JADWAL];
