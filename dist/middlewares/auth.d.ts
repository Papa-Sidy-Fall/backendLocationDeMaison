import type { RequestHandler, Response } from "express";
export interface AuthContext {
    userId: number;
    email: string;
    role: string;
}
export declare const getAuthContext: (res: Response) => AuthContext;
export declare const requireAuth: RequestHandler;
export declare const requireAdmin: RequestHandler;
//# sourceMappingURL=auth.d.ts.map