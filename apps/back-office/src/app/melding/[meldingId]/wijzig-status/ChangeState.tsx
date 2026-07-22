'use client'

import { ActionGroup, Button, Field, Grid, Heading, Label, Select } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect } from 'react'

import type { MeldingOutput, StatesOutput } from '@meldingen/api-client'

import { BackLink } from '../_components/BackLink'
import { CancelLink } from '../_components/CancelLink'
import { postChangeStateForm } from './actions'
import { ApiErrorAlert } from '~/app/_components'

import styles from './ChangeState.module.css'

type Props = {
  meldingId: number
  meldingState: MeldingOutput['state']
  possibleStates: StatesOutput['states']
  publicId: MeldingOutput['public_id']
}

const initialState: {
  apiError?: {
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
  const postChangeStateFormWithMeldingId = postChangeStateForm.bind(null, { currentState: meldingState, meldingId })

  const [{ apiError, meldingStateFromAction }, formAction, isPending] = useActionState(
    postChangeStateFormWithMeldingId,
    initialState,
  )

  const t = useTranslations('change-state')
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

  const stateToDisplay = meldingStateFromAction ?? meldingState

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
