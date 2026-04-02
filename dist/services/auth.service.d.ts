import type { LoginInput, RegisterInput } from "../types/models.js";
interface AuthPayload {
    token: string;
    user: {
        id: number;
        fullName: string;
        email: string;
        phone: string;
        role: "admin" | "user";
    };
}
export declare const register: (input: RegisterInput) => Promise<AuthPayload>;
export declare const login: (input: LoginInput) => Promise<AuthPayload>;
export {};
//# sourceMappingURL=auth.service.d.ts.map