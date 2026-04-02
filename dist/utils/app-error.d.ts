export declare class AppError extends Error {
    readonly statusCode: number;
    readonly details?: unknown;
    constructor(message: string, statusCode?: number, details?: unknown);
}
//# sourceMappingURL=app-error.d.ts.map