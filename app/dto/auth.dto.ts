import { UserResult } from "./user.dto";

export interface AuthPayload {
    username: string;
    password: string;
}

export interface AuthResult extends UserResult {
    token: string
}
