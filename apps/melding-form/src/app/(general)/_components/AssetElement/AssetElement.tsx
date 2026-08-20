import Image from 'next/image'

import type { Feature } from '@meldingen/api-client'

import { Paragraph } from '@meldingen/ui'

import { getContainerAssetIconSVG } from '~/app/(map)/locatie/kies/_components/AssetList/getContainerAssetIconSVG'

import styles from './AssetElement.module.css'

type Props = {
  asset: Feature
}

export const AssetElement = ({ asset }: Props) => {
  const icon = getContainerAssetIconSVG(asset)
  const label = `${asset.properties?.fractie_omschrijving ?? ''} container - ${asset.properties?.id_nummer}`

  return (
    <span className={styles.assetElement}>
      <Image alt="" height={32} src={icon} width={32} />
      <Paragraph>{label}</Paragraph>
    </span>
  )
}
