// React-admin validation function for integer values.
export const isInteger =
  (message = 'ra.validation.integer') =>
  (value: string | null) =>
    value === null || value === undefined || !Number.isInteger(Number(value)) ? message : undefined
