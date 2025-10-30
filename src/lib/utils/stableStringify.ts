export const stableStringify = (obj: unknown): string => {
  if (obj === null || obj === undefined) return "null";
  if (typeof obj !== "object") return String(obj);

  const sorted = Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      const value = (obj as Record<string, unknown>)[key];
      if (value !== undefined) {
        acc[key] =
          typeof value === "object" && value !== null
            ? JSON.parse(stableStringify(value))
            : value;
      }
      return acc;
    }, {} as Record<string, unknown>);

  return JSON.stringify(sorted);
};
