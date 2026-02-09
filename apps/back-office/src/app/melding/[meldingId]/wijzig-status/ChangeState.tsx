'use client'

import { Alert, Field, Grid, Heading, Label, Select } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef } from 'react'

import { MeldingOutput, StatesOutput } from '@meldingen/api-client'
import { Paragraph, SubmitButton } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'
import { postChangeStateForm } from './actions'

import styles from './ChangeState.module.css'

type Props = {
  meldingId: number
  meldingState: MeldingOutput['state']
  possibleStates: StatesOutput['states']
  publicId: MeldingOutput['public_id']
}

const initialState: { meldingStateFromAction?: string; systemError?: unknown } = {}

type ArgsType = {
  errorMessage: string
  hasSystemError: boolean
  originalDocTitle: string
}

const getDocumentTitleOnError = ({ errorMessage, hasSystemError, originalDocTitle }: ArgsType) => {
  if (hasSystemError) {
    return `${errorMessage} - ${originalDocTitle}`
  }

  return originalDocTitle
}

export const ChangeState = ({ meldingId, meldingState, possibleStates, publicId }: Props) => {
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const postChangeStateFormWithMeldingId = postChangeStateForm.bind(null, { meldingId })

  const [{ meldingStateFromAction, systemError }, formAction] = useActionState(
    postChangeStateFormWithMeldingId,
    initialState,
  )

  const t = useTranslations('change-state')
  const tShared = useTranslations('shared')

  const documentTitle = getDocumentTitleOnError({
    errorMessage: t('errors.unable-to-change-state.heading'),
    hasSystemError: Boolean(systemError),
    originalDocTitle: t('metadata.title'),
  })

  // Set focus on SystemErrorAlert when there is a system error
  useEffect(() => {
    if (systemError && systemErrorAlertRef.current) {
      systemErrorAlertRef.current.focus()
    }
  }, [systemError])

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  return (
    <main>
      <title>{documentTitle}</title>
      <Grid paddingBottom="2x-large" paddingTop="x-large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
          <BackLink className="ams-mb-s" href={`/melding/${meldingId}`}>
            {t('back-link')}
          </BackLink>
          <Heading className="ams-mb-l" level={1}>
            {t('title', { publicId })}
          </Heading>
          {Boolean(systemError) && (
            <Alert
              className={clsx('ams-mb-m', styles.alert)}
              heading={t('errors.unable-to-change-state.heading')}
              headingLevel={2}
              ref={systemErrorAlertRef}
              role="alert"
              severity="error"
              tabIndex={-1}
            >
              <Paragraph>{t('errors.unable-to-change-state.description')}</Paragraph>
            </Alert>
          )}
          <Form action={formAction} noValidate>
            <Field className="ams-mb-l">
              <Label htmlFor="state">{t('label')}</Label>
              {/* TODO: check if setting melding state from action works */}
              <Select defaultValue={meldingStateFromAction ?? meldingState} id="state" name="state">
                <Select.Option value={meldingState}>{tShared(`state.${meldingState}`)}</Select.Option>
                {possibleStates.map((state) => (
                  <Select.Option key={state} value={state}>
                    {tShared(`state.${state}`)}
                  </Select.Option>
                ))}
              </Select>
            </Field>
            <SubmitButton>{t('submit-button')}</SubmitButton>
          </Form>
        </Grid.Cell>
      </Grid>
    </main>
  )
}
