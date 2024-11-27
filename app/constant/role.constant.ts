export const ROLE = {
    ADMIN: "ADMIN",
    SALES: "SALES",
    DRIVER: "DRIVER",
} as const;

export type TYPE_ROLE = (typeof ROLE)[keyof typeof ROLE];