export const safeJSONParse = <T, F = undefined>(value: unknown, fallback: F): T | F => {
  if (!value || typeof value !== 'string') return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
