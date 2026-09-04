import Image from 'next/image'

import { Paragraph } from '@meldingen/ui'

import type { AssetItem } from '../../_utils/formatAssetItem'

import { getAssetIconSVG } from '~/app/_utils/getAssetIconSVG'

import styles from './AssetElement.module.css'

type Props = {
  asset: AssetItem
}

export const AssetElement = ({ asset }: Props) => {
  const icon = getAssetIconSVG(asset)

  return (
    <div className={styles.assetElement}>
      <Image alt="" height={32} src={icon} width={32} />
      <Paragraph>{asset.label}</Paragraph>
    </div>
  )
}
