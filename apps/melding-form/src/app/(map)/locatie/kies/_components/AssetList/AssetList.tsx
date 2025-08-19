import clsx from 'clsx'

import { Feature } from '@meldingen/api-client'

import styles from './AssetList.module.css'

type Props = {
  assetList: Feature[]
}

export const AssetList = ({ assetList }: Props) => {
  return (
    <div className={clsx(styles.container, 'ams-mb-m')}>
      <ul>
        {assetList.map((asset) => {
          // @ts-expect-error id_nummer always exists on asset properties
          const idNummer = asset.properties.id_nummer as string
          return (
            <li key={asset.id} className={styles.item}>
              <span className={styles.name}>{idNummer}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
