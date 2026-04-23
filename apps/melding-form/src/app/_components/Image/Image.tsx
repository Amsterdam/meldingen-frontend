import NextImage from 'next/image'
import { useState } from 'react'

const FALLBACK_SRC = '/asset-fallback.svg'

type Props = {
  alt: string
  fallbackSrc?: string
  height: number
  src: string
  width: number
}

export const Image = ({ fallbackSrc = FALLBACK_SRC, src, ...rest }: Props) => {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <NextImage
      {...rest}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
      src={imgSrc}
    />
  )
}
