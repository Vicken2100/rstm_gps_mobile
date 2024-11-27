export const STATUS = {
    TERSEDIA: "TERSEDIA",
    TIDAK_TERSEDIA: "TIDAK_TERSEDIA",
} as const;

export type TYPE_STATUS = (typeof STATUS)[keyof typeof STATUS];
