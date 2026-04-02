export const removeDiacritics = (value: string): string =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const normalizeText = (value: string): string =>
  removeDiacritics(value).trim().toLowerCase();

export const buildAvatar = (fullName: string): string => {
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

export const formatDateOnly = (date: Date): string => date.toISOString().split("T")[0] ?? "";
