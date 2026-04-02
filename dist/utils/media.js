import path from "node:path";
const DEFAULT_PORT = "4004";
export const uploadsRootDir = path.resolve(process.cwd(), "uploads");
export const propertyUploadsDir = path.join(uploadsRootDir, "properties");
const sanitizeBaseUrl = (value) => value.trim().replace(/\/+$/, "");
export const getPublicBaseUrl = () => {
    const configured = process.env.PUBLIC_BASE_URL;
    if (configured && configured.trim().length > 0) {
        return sanitizeBaseUrl(configured);
    }
    const port = process.env.PORT?.trim() || DEFAULT_PORT;
    return `http://localhost:${port}`;
};
export const toStoredPropertyImagePath = (filename) => `/uploads/properties/${filename}`;
export const resolvePublicAssetUrl = (value) => {
    const normalized = value.trim();
    if (normalized.length === 0) {
        return "";
    }
    if (/^https?:\/\//i.test(normalized)) {
        return normalized;
    }
    const relativePath = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${getPublicBaseUrl()}${relativePath}`;
};
//# sourceMappingURL=media.js.map