export const normalizeProfileValue = (value: string, maxLength: number) =>
  value.trim().replace(/\s+/g, " ").slice(0, maxLength);
