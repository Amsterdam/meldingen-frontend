import type { ImageProps } from 'next/image'

import NextImage from 'next/image'
import { useState } from 'react'

import type { Feature } from '@meldingen/api-client'

import type { AssetTypeIconConfig } from '~/types'

export const FALLBACK_SRC = '/asset-fallback.svg'

const getAssetIconSVG = (properties: Feature['properties'], { iconEntry, iconFolder }: AssetTypeIconConfig) => {
  const assetSubType = iconEntry ? (properties?.[iconEntry] as string) : undefined

  if (!iconFolder || !assetSubType) {
    return FALLBACK_SRC
  }

  return `/${iconFolder}/${assetSubType.toLowerCase()}.svg`
}

type Props = Omit<ImageProps, 'src'> & {
  assetTypeIconConfig: AssetTypeIconConfig
  properties: Feature['properties']
}

export const AssetIcon = ({ assetTypeIconConfig, properties, ...rest }: Props) => {
  const src = getAssetIconSVG(properties, assetTypeIconConfig)
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
