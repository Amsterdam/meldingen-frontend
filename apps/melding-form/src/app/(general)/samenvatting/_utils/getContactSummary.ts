export const getContactSummary = (label: string, email?: string | null, phone?: string | null) => {
  if (!email && !phone) return undefined

  return {
    description: [email, phone].filter((item) => item !== undefined && item !== null), // Filter out undefined or null items
    key: 'contact',
    term: label,
  }
}
