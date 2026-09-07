import Image from 'next/image'
import { useState } from 'react'

import { Paragraph } from '@meldingen/ui'

import type { AssetItem } from '../../_utils/formatAssetItem'

import { getAssetIconSVG } from '~/app/_utils/getAssetIconSVG'
import { ASSET_FALLBACK_SRC } from '~/constants'

import styles from './AssetElement.module.css'

type Props = {
  asset: AssetItem
}

export const AssetElement = ({ asset }: Props) => {
  const src = getAssetIconSVG(asset)
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <div className={styles.assetElement}>
      <Image
        alt=""
        height={32}
        onError={() => {
          setImgSrc(ASSET_FALLBACK_SRC)
        }}
        src={imgSrc}
        width={32}
      />
      <Paragraph>{asset.label}</Paragraph>
    </div>
  )
}
