import { Feature } from '@meldingen/api-client'

export const getAssetIconSVG = (
  properties: Feature['properties'],
  { iconEntry, iconFolder }: { iconEntry?: string; iconFolder?: string },
) => {
  const assetSubType = iconEntry ? (properties?.[iconEntry] as string) : undefined

  if (!iconFolder || !assetSubType) {
    return '/happy.png'
  }

  return `/${iconFolder}/${assetSubType?.toLocaleLowerCase()}.svg`
}
