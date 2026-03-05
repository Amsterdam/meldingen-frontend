'use client'

import {
  ActionGroup,
  Alert,
  Button,
  Field,
  Grid,
  Heading,
  Label,
  Paragraph,
  Select,
} from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef } from 'react'

import { MeldingOutput, StatesOutput } from '@meldingen/api-client'

import { BackLink } from '../_components/BackLink'
import { CancelLink } from '../_components/CancelLink'
import { postChangeStateForm } from './actions'

import styles from './ChangeState.module.css'

type Props = {
  meldingId: number
  meldingState: MeldingOutput['state']
  possibleStates: StatesOutput['states']
  publicId: MeldingOutput['public_id']
}

const initialState: {
  error?: {
    message: unknown
    type: 'invalid-state' | 'state-change-failed'
  }
  meldingStateFromAction?: string
} = {}

type ArgsType = {
  errorMessage: string
  hasError: boolean
  originalDocTitle: string
}

const getDocumentTitleOnError = ({ errorMessage, hasError, originalDocTitle }: ArgsType) => {
  if (hasError) {
    return `${errorMessage} - ${originalDocTitle}`
  }

  return originalDocTitle
}

export const ChangeState = ({ meldingId, meldingState, possibleStates, publicId }: Props) => {
  const errorAlertRef = useRef<HTMLDivElement>(null)

  const postChangeStateFormWithMeldingId = postChangeStateForm.bind(null, { currentState: meldingState, meldingId })

  const [{ error, meldingStateFromAction }, formAction] = useActionState(postChangeStateFormWithMeldingId, initialState)

  const t = useTranslations('change-state')
  const tShared = useTranslations('shared')

  const documentTitle = getDocumentTitleOnError({
    errorMessage: error ? t(`errors.${error.type}.heading`) : '',
    hasError: Boolean(error),
    originalDocTitle: t('metadata.title'),
  })

  useEffect(() => {
    if (error) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error.message)

      // Set focus on Alert when there is an error
      if (errorAlertRef.current) {
        errorAlertRef.current.focus()
      }
    }
  }, [error])

  const stateToDisplay = meldingStateFromAction ?? meldingState

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
            <Field className={clsx(styles.whiteField, 'ams-mb-m')}>
              <Label htmlFor="state">{t('label')}</Label>
              <Select
                defaultValue={stateToDisplay}
                id="state"
                // React doesn't update the defaultValue of a select element after the initial render,
                // so we use the key prop to force a remount of the select element when stateToDisplay changes
                key={stateToDisplay}
                name="state"
              >
                <Select.Option value={meldingState}>{tShared(`state.${meldingState}`)}</Select.Option>
                {possibleStates.map((state) => (
                  <Select.Option key={state} value={state}>
                    {tShared(`state.${state}`)}
                  </Select.Option>
                ))}
              </Select>
            </Field>
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
