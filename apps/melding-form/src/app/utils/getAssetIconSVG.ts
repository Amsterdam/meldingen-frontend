import { Feature } from '@meldingen/api-client'

import { FALLBACK_SRC } from '../../constants'

export const getAssetIconSVG = (
  properties: Feature['properties'],
  { iconEntry, iconFolder }: { iconEntry?: string; iconFolder?: string },
) => {
  const assetSubType = iconEntry ? (properties?.[iconEntry] as string) : undefined

  if (!iconFolder || !assetSubType) {
    return FALLBACK_SRC
  }

  return `/${iconFolder}/${assetSubType?.toLocaleLowerCase()}.svg`
}
