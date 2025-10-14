import { Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

import { BackLink } from 'apps/melding-form/src/app/(general)/_components/BackLink/BackLink'

import styles from './SideBar.module.css'

export const SideBar = ({ children }: PropsWithChildren) => {
  const t = useTranslations('select-location')

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <BackLink className="ams-mb-s" href="/locatie">
          {t('back-link')}
        </BackLink>
        <Heading level={1} size="level-4">
          {t('title')}
        </Heading>
        <Paragraph size="small">{t('description')}</Paragraph>
      </div>
      {children}
    </div>
  )
}
