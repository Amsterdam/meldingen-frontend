import { Feature } from '@meldingen/api-client'

export const getAssetIconSVG = (
  properties: Feature['properties'],
  { iconEntry, iconFolder }: { iconEntry?: string; iconFolder?: string },
) => {
  const assetTypeCategory = iconEntry ? (properties?.[iconEntry] as string) : undefined

  if (!iconFolder || !assetTypeCategory) {
    return '/happy.png'
  }

  return `/${iconFolder}/${assetTypeCategory?.toLocaleLowerCase()}.svg`
}
