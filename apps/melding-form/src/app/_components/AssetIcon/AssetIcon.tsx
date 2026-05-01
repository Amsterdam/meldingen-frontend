import NextImage, { ImageProps } from 'next/image'
import { useState } from 'react'

import { Feature } from '@meldingen/api-client'

import { FALLBACK_SRC } from '../../../constants'

const getAssetIconSVG = (
  properties: Feature['properties'],
  { iconEntry, iconFolder }: { iconEntry?: string; iconFolder?: string },
) => {
  const assetSubType = iconEntry ? (properties?.[iconEntry] as string) : undefined

  if (!iconFolder || !assetSubType) {
    return FALLBACK_SRC
  }

  return `/${iconFolder}/${assetSubType.toLowerCase()}.svg`
}

type Props = Omit<ImageProps, 'src'> & {
  assetTypeIconConfig: {
    iconEntry?: string
    iconFolder?: string
  }
  properties: Feature['properties']
}

export const AssetIcon = ({ assetTypeIconConfig, properties, ...rest }: Props) => {
  const src = getAssetIconSVG(properties, assetTypeIconConfig ?? {})
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <NextImage
      {...rest}
      onError={() => {
        setImgSrc(FALLBACK_SRC)
      }}
      src={imgSrc}
    />
  )
}
