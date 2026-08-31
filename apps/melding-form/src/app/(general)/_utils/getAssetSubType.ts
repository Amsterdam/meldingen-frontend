export const getAssetSubType = (subTypeKey: string | undefined, properties: Record<string, unknown> | null) => {
  if (!properties || !subTypeKey) return undefined

  if (properties?.[subTypeKey]) {
    return properties[subTypeKey] as string
  }

  return undefined
}
