'use client'

import type { ReactNode } from 'react'

import { Grid, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { useRemoveAttachmentError } from '../_context/RemoveAttachmentErrorContext'
import { BackLink } from '../../_components/BackLink'
import { ApiErrorAlert } from '~/app/_components'

type Props = {
  children: ReactNode
  meldingId: number
}

export const Page = ({ children, meldingId }: Props) => {
  const { apiError } = useRemoveAttachmentError()
  const t = useTranslations('remove-attachment')
  const backLinkHref = `/melding/${meldingId}`

  return (
    <div className="ams-page__area--body">
      <BackLink href={backLinkHref}>{t('back-link')}</BackLink>

      <Grid as="main">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {apiError && <ApiErrorAlert description={apiError} shouldFocus={true} />}

          <Heading className="ams-mb-l" level={1}>
            {t('title')}
          </Heading>
          {children}
        </Grid.Cell>
      </Grid>
    </div>
  )
}
