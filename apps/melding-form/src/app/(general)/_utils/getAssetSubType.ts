// subTypeKey refers to the Asset ->  Icon -> Koppelcode in the Admin Asset
export const getAssetSubType = (subTypeKey: string | undefined, properties: Record<string, unknown> | null) => {
  if (!properties || !subTypeKey) return undefined

  const subtype = properties[subTypeKey]

  if (subtype == null || subtype === '') return undefined

  return String(subtype)
}
