import type { ImageProps } from 'next/image'

import NextImage from 'next/image'
import { useState } from 'react'

import type { Feature } from '@meldingen/api-client'

import { ASSET_FALLBACK_SRC } from '~/constants'

type Props = Omit<ImageProps, 'src'> & {
  iconConfig: {
    entry?: string
    folder?: string
  }
  properties: Feature['properties']
}

const getAssetIconSVG = (properties: Feature['properties'], { entry, folder }: Props['iconConfig']) => {
  const assetSubType = entry ? (properties?.[entry] as string) : undefined

  if (!folder || !assetSubType) {
    return ASSET_FALLBACK_SRC
  }

  return `/${folder}/${assetSubType.toLowerCase()}.svg`
}

export const AssetIcon = ({ iconConfig, properties, ...rest }: Props) => {
  const src = getAssetIconSVG(properties, iconConfig)
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <NextImage
      {...rest}
      onError={() => {
        setImgSrc(ASSET_FALLBACK_SRC)
      }}
      src={imgSrc}
    />
  )
}
