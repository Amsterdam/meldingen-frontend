import { Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

import { BackLink } from 'apps/melding-form/src/app/_components'
import { TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'

import styles from './SideBarTop.module.css'

export const SideBarTop = ({ children }: PropsWithChildren) => {
  const t = useTranslations('select-location')

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <BackLink className="ams-mb-m" href={`/locatie#${TOP_ANCHOR_ID}`}>
          {t('back-link')}
        </BackLink>
        <Heading className="ams-mb-s" level={1} size="level-2">
          {t('title')}
        </Heading>
        <Paragraph>{t('description')}</Paragraph>
      </div>
      {children}
    </div>
  )
}
