import NextImage, { ImageProps } from 'next/image'
import { useState } from 'react'

import { FALLBACK_SRC } from '../../../constants'

export const AssetIcon = ({ src, ...rest }: ImageProps) => {
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
