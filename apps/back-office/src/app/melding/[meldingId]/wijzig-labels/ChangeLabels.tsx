'use client'

import {
  ActionGroup,
  Alert,
  Button,
  Checkbox,
  FieldSet,
  Grid,
  Heading,
  Paragraph,
} from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef } from 'react'

import type { LabelOutput, MeldingOutput } from '@meldingen/api-client'

import { BackLink } from '../_components/BackLink'
import { CancelLink } from '../_components/CancelLink'
import { postChangeLabelsForm } from './actions'

import styles from './ChangeLabels.module.css'

export type Props = {
  currentLabelIds?: number[]
  labels: LabelOutput[]
  meldingId: number
  publicId: MeldingOutput['public_id']
}

const initialState: {
  error?: unknown
  labelIdsFromAction?: number[]
} = {}

export const ChangeLabels = ({ currentLabelIds, labels, meldingId, publicId }: Props) => {
  const errorAlertRef = useRef<HTMLDivElement>(null)

  const [{ error, labelIdsFromAction }, formAction] = useActionState(
    postChangeLabelsForm.bind(null, { currentLabelIds, meldingId }),
    initialState,
  )

  const t = useTranslations('change-labels')

  const baseTitle = t('metadata.title')
  const documentTitle = error ? `${t('errors.labels-change-failed.heading')} - ${baseTitle}` : baseTitle

  useEffect(() => {
    if (!error) return

    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)

    if (errorAlertRef.current) {
      errorAlertRef.current.focus()
    }
  }, [error])

  return (
    <div className="ams-page__area--body">
      <title>{documentTitle}</title>
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
          {Boolean(error) && (
            <Alert
              className={clsx('ams-mb-m', styles.alert)}
              heading={t('errors.labels-change-failed.heading')}
              headingLevel={2}
              ref={errorAlertRef}
              role="alert"
              severity="error"
              tabIndex={-1}
            >
              <Paragraph>{t('errors.labels-change-failed.description')}</Paragraph>
            </Alert>
          )}
          <Heading className="ams-mb-m" level={1}>
            {t('title', { publicId })}
          </Heading>
          <Form action={formAction} noValidate>
            <FieldSet className={clsx(styles.whiteField, 'ams-mb-m')} legend={t('label')}>
              {labels.map(({ id, name }) => {
                // Label ids from the action take priority so the selection reflects the user's last submission, even on error
                const activeLabelIds = labelIdsFromAction ?? currentLabelIds ?? []
                const isChecked = activeLabelIds.includes(id)
                return (
                  <Checkbox defaultChecked={isChecked} key={id} name="labels" value={String(id)}>
                    {name}
                  </Checkbox>
                )
              })}
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
