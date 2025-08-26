import { Button } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

import { Feature } from '@meldingen/api-client'

import styles from '../../SelectLocation.module.css'

export type Props = {
  assetList: Feature[]
  handleAssetListToggle: () => void
  showAssetList: boolean
}

export const AssetListToggle = ({ assetList, handleAssetListToggle, showAssetList }: Props) => {
  const t = useTranslations('select-location')

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
