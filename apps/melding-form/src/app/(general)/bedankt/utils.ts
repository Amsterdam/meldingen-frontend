export const getDescription = (
  t: (key: string, params?: Record<string, string | number | Date> | undefined) => string,
  publicId?: string,
  createdAt?: string,
) => {
  if (publicId && createdAt) {
    const date = new Date(createdAt).toLocaleDateString('nl-NL')
    const time = new Date(createdAt).toLocaleTimeString('nl-NL', { timeStyle: 'short' })
    return t('description.default', { publicId, date, time })
  }

  if (!publicId && createdAt) {
    const date = new Date(createdAt).toLocaleDateString('nl-NL')
    const time = new Date(createdAt).toLocaleTimeString('nl-NL', { timeStyle: 'short' })
    return t('description.no-public-id', { date, time })
  }

  if (!createdAt && publicId) {
    return t('description.no-date', { publicId })
  }

  return t('description.fallback')
}
