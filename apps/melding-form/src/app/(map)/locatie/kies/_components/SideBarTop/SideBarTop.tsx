import type { PropsWithChildren } from 'react'

import { Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { BackLink } from '~/app/_components'
import { TOP_ANCHOR_ID } from '~/constants'

import styles from './SideBarTop.module.css'

export const SideBarTop = ({ children }: PropsWithChildren) => {
  const t = useTranslations('select-location')

  return (
    <div className={styles.container}>
      <BackLink href={`/locatie#${TOP_ANCHOR_ID}`}>{t('back-link')}</BackLink>

      <div className={styles.intro}>
        <Heading className="ams-mb-s" level={1} size="level-2">
          {t('title')}
        </Heading>

        <Paragraph>{t('description')}</Paragraph>
      </div>

      {children}
    </div>
  )
}
