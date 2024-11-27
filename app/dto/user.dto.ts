import { TYPE_ROLE } from "../constant/role.constant";
import { BaseResult } from "./commmon.dto";

export interface UserResult extends BaseResult {
    noHP: string;
    name: string;
    username: string;
    role: TYPE_ROLE;
}

export interface CreateUserPayload {
    noHP: string;
    name: string;
    username: string;
    password: string;
    role: TYPE_ROLE;
}
