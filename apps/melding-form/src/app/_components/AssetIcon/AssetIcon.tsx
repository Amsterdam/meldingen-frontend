import type { ImageProps } from 'next/image'

import NextImage from 'next/image'
import { useState } from 'react'

import type { Feature } from '@meldingen/api-client'

import { FALLBACK_SRC } from '~/constants'

type Props = Omit<ImageProps, 'src'> & {
  assetTypeIconConfig: {
    entry?: string
    folder?: string
  }
  properties: Feature['properties']
}

const getAssetIconSVG = (properties: Feature['properties'], { entry, folder }: Props['assetTypeIconConfig']) => {
  const assetSubType = entry ? (properties?.[entry] as string) : undefined

  if (!folder || !assetSubType) {
    return FALLBACK_SRC
  }

  return `/${folder}/${assetSubType.toLowerCase()}.svg`
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
