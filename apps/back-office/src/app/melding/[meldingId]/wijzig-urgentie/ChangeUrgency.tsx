'use client'

import { ActionGroup, Alert, Button, Grid, Heading, Paragraph, Radio } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef } from 'react'

import { BackLink } from '../_components/BackLink'
import { CancelLink } from '../_components/CancelLink'
import { postChangeUrgencyForm } from './actions'
import { FieldSet } from 'libs/ui/src/FieldSet/FieldSet'

import styles from './ChangeUrgency.module.css'

export type Props = {
  currentUrgency: -1 | 0 | 1
  meldingId: number
  publicId: string
}

const initialState: {
  error?: {
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

const URGENCY_OPTIONS = [
  { labelKey: 'urgency.[-1]', value: '-1' },
  { labelKey: 'urgency.[0]', value: '0' },
  { labelKey: 'urgency.[1]', value: '1' },
] as const

export const ChangeUrgency = ({ currentUrgency, meldingId, publicId }: Props) => {
  const errorAlertRef = useRef<HTMLDivElement>(null)

  const postChangeUrgencyFormWithMeldingId = postChangeUrgencyForm.bind(null, {
    currentUrgency,
    meldingId,
  })

  const [{ error, urgencyFromAction }, formAction] = useActionState(postChangeUrgencyFormWithMeldingId, initialState)

  const t = useTranslations('change-urgency')
  const tShared = useTranslations('shared')

  const documentTitle = getDocumentTitleOnError({
    errorMessage: error ? t(`errors.${error.type}.heading`) : '',
    hasError: Boolean(error),
    originalDocTitle: t('metadata.title'),
  })

  useEffect(() => {
    if (!error) return

    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)

    if (errorAlertRef.current) {
      errorAlertRef.current.focus()
    }
  }, [error])

  const urgencyToDisplay = urgencyFromAction ?? String(currentUrgency)

  return (
    <div className="ams-page__area--body">
      <title>{documentTitle}</title>
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
          {error && (
            <Alert
              className={clsx('ams-mb-m', styles.alert)}
              heading={t(`errors.${error.type}.heading`)}
              headingLevel={2}
              ref={errorAlertRef}
              role="alert"
              severity="error"
              tabIndex={-1}
            >
              <Paragraph>{t(`errors.${error.type}.description`)}</Paragraph>
            </Alert>
          )}

          <Heading className="ams-mb-m" level={1}>
            {t('title', { publicId })}
          </Heading>

          <Form action={formAction} noValidate>
            <FieldSet
              className={clsx(styles.whiteField, 'ams-mb-m')}
              hasHeading={false}
              legend={t('label')}
              role="radiogroup"
            >
              {URGENCY_OPTIONS.map((option) => (
                <Radio
                  defaultChecked={urgencyToDisplay === option.value}
                  id={`urgency-${option.value}`}
                  key={option.value}
                  name="urgency"
                  value={option.value}
                >
                  {tShared(option.labelKey)}
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
