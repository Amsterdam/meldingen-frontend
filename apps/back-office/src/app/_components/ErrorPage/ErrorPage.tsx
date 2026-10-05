import { useTranslations } from 'next-intl'
import React from 'react'

import { Button, Grid, Heading } from '@meldingen/ui'

import styles from './ErrorPage.module.css'

type Props = {
  error: Error & { digest?: string }
  retry: () => void
}

export const ErrorPage = ({ retry }: Props) => {
  const t = useTranslations('error')

  return (
    <Grid as="main" className={styles.container} paddingVertical="2x-large">
      <Grid.Cell
        appearance="transparent"
        span={{ narrow: 4, medium: 6, wide: 6 }}
        start={{ narrow: 1, medium: 2, wide: 4 }}
      >
        <Heading className="ams-mb-l" level={1} size="level-2">
          {t('title')}
        </Heading>

        <Button onClick={retry}>{t('retry-button')}</Button>
      </Grid.Cell>
    </Grid>
  )
}
