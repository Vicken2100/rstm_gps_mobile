
import { BASE_URL } from ".";
import { AuthPayload, AuthResult } from "../dto/auth.dto";
import { Responses } from "../dto/commmon.dto";

export const login = async (payload: AuthPayload): Promise<AuthResult | string> => {
    try {
        const response = await fetch(`${BASE_URL}/auth`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            return "Username atau password salah"
        }

        const result = await response.json() as Responses<AuthResult>;

        return result.data;
    } catch (error: unknown) {
        return "Username atau password salah"
    }
}