export const removeDiacritics = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
export const normalizeText = (value) => removeDiacritics(value).trim().toLowerCase();
export const buildAvatar = (fullName) => {
    const tokens = fullName
        .split(" ")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 2);
    if (tokens.length === 0) {
        return "NA";
    }
    return tokens.map((part) => part[0]?.toUpperCase() ?? "").join("");
};
export const formatDateOnly = (date) => date.toISOString().split("T")[0] ?? "";
//# sourceMappingURL=helpers.js.map