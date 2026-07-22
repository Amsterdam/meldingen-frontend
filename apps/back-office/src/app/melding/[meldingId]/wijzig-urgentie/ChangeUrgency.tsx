'use client'

import { ActionGroup, Button, FieldSet, Grid, Heading, Radio } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect } from 'react'

import type { MeldingOutput } from '@meldingen/api-client'

import { BackLink } from '../_components/BackLink'
import { CancelLink } from '../_components/CancelLink'
import { postChangeUrgencyForm } from './actions'
import { ApiErrorAlert } from '~/app/_components'
import { URGENCY_VALUES } from '~/constants'

import styles from './ChangeUrgency.module.css'

export type Props = {
  currentUrgency: MeldingOutput['urgency']
  meldingId: number
  publicId: MeldingOutput['public_id']
}

const initialState: {
  apiError?: {
    message: unknown
    type: 'invalid-urgency' | 'urgency-change-failed'
  }
  urgencyFromAction?: string
} = {}

type DocumentTitleArgs = {
  errorMessage: string
  hasError: boolean
  originalDocTitle: string
}

const getDocumentTitleOnError = ({ errorMessage, hasError, originalDocTitle }: DocumentTitleArgs) => {
  if (hasError) return `${errorMessage} - ${originalDocTitle}`

  return originalDocTitle
}

export const ChangeUrgency = ({ currentUrgency, meldingId, publicId }: Props) => {
  const postChangeUrgencyFormWithMeldingId = postChangeUrgencyForm.bind(null, {
    currentUrgency,
    meldingId,
  })

  const [{ apiError, urgencyFromAction }, formAction, isPending] = useActionState(
    postChangeUrgencyFormWithMeldingId,
    initialState,
  )

  const t = useTranslations('change-urgency')
  const tShared = useTranslations('shared')

  const documentTitle = getDocumentTitleOnError({
    errorMessage: apiError ? t(`errors.${apiError.type}.heading`) : '',
    hasError: Boolean(apiError),
    originalDocTitle: t('metadata.title'),
  })

  useEffect(() => {
    if (apiError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(apiError)
    }
  }, [apiError])

  const urgencyToDisplay = urgencyFromAction ?? String(currentUrgency)

  return (
    <div className="ams-page__area--body">
      <title>{documentTitle}</title>
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {apiError && (
            <ApiErrorAlert
              description={t(`errors.${apiError.type}.description`)}
              heading={t(`errors.${apiError.type}.heading`)}
              shouldRefocus={!isPending}
            />
          )}
          <Heading className="ams-mb-m" level={1}>
            {t('title', { publicId })}
          </Heading>
          <Form action={formAction} noValidate>
            <FieldSet className={clsx(styles.whiteField, 'ams-mb-m')} legend={t('label')} role="radiogroup">
              {URGENCY_VALUES.map((urgency) => (
                <Radio
                  defaultChecked={urgencyToDisplay === String(urgency)}
                  key={urgency}
                  name="urgency"
                  value={String(urgency)}
                >
                  {tShared(`urgency.${urgency}`)}
                </Radio>
              ))}
            </FieldSet>
            <ActionGroup>
              <Button type="submit">{t('submit-button')}</Button>
              <CancelLink href={`/melding/${meldingId}`}>{t('cancel-link')}</CancelLink>
            </ActionGroup>
          </Form>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
