import type { Feature } from '@meldingen/api-client'

export const getAssetLabelText = (asset: Feature, labelTemplate?: string) => {
  // `id` always exists on WFS layers from the City of Amsterdam
  if (!labelTemplate) return asset.id

  const label = labelTemplate
    // Replace each {{field_name}} placeholder with the matching value from asset.properties
    // For example, '{{fractie_omschrijving}} container - {{id_nummer}}' will become 'Papier container - 12345'
    .replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = asset.properties?.[key]
      return value !== undefined && value !== null ? String(value) : ''
    })
    .trim()

  return label || asset.id
}
