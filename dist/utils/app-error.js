export class AppError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 500, details) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        if (details !== undefined) {
            this.details = details;
        }
    }
}
//# sourceMappingURL=app-error.js.map