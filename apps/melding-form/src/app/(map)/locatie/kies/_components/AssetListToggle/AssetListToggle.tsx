import { Button } from '@amsterdam/design-system-react'
import clsx from 'clsx'

import { Feature } from '@meldingen/api-client'

import styles from '../../SelectLocation.module.css'

type Props = {
  assetList: Feature[]
  showAssetList: boolean
  t: (key: string) => string
  handleAssetListToggle: () => void
}

export const AssetListToggle = ({ assetList, showAssetList, t, handleAssetListToggle }: Props) => {
  if (assetList.length === 0) return null

  return (
    <Button
      variant="secondary"
      onClick={handleAssetListToggle}
      className={clsx(styles.toggleButton, showAssetList && styles.removeAbsolutePosition)}
    >
      {showAssetList ? t('toggle-button.map') : t('toggle-button.list')}
    </Button>
  )
}
