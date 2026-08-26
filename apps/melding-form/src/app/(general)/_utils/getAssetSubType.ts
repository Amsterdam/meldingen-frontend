// Based on the the WFS response from the City of Amsterdam
// A subtype is for example for:
// containers: 'Restafval', 'Glas', 'Textiel', 'Plastic'
// lichten: 'Grachtmast', 'Overspanning'
const ASSET_SUBTYPE_PROPERTY_KEYS = ['objecttype_omschrijving', 'fractie_omschrijving'] as const

export const getAssetSubType = (properties: Record<string, unknown> | null) => {
  if (!properties) return undefined

  for (const key of ASSET_SUBTYPE_PROPERTY_KEYS) {
    if (properties?.[key]) {
      return properties[key] as string
    }
  }

  return undefined
}
