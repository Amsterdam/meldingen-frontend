'use client'

import { Button, Grid, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef, useState } from 'react'

import type { LabelOutput, SourceOutput, StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { Column, Paragraph } from '@meldingen/ui'

import type { FormState } from './actions'
import type { MeldingData } from './types'

import { InvalidFormAlert, LabelsField, PrimaryField, SourceField, SystemErrorAlert, UrgencyField } from './_components'
import { postMeldingForm } from './actions'

import styles from './MeldingForm.module.css'

type Props = {
  defaultValues?: { labels?: number[]; primary?: string; source?: string; urgency?: number }
  existingId?: number
  existingMelding?: MeldingData
  existingToken?: string
  labels: LabelOutput[]
  primaryTextArea: StaticFormTextAreaComponentOutput
  sources: SourceOutput[]
}

// Form components can be prefilled on load on the server, where we fill in existing answers from the backend,
// or in case of an error, where we use the form data provided.
// If there is form data, it should take priority over the prefilled components from the server.
const calculateDefaultValues = (formData?: FormData, defaultValues?: Props['defaultValues']) => {
  const primaryDefaultValue = (formData?.get('primary') as string | null) ?? defaultValues?.primary ?? ''
  const sourceDefaultValue = (formData?.get('source') as string | null) ?? defaultValues?.source ?? ''
  const labelsDefaultValues = formData?.getAll('labels').map((label) => Number(label)) ?? defaultValues?.labels ?? []
  const rawUrgency = formData?.get('urgency')
  const urgencyDefaultValue =
    rawUrgency !== null && rawUrgency !== undefined ? Number(rawUrgency) : (defaultValues?.urgency ?? 0)

  return { labelsDefaultValues, primaryDefaultValue, sourceDefaultValue, urgencyDefaultValue }
}

const initialState: FormState = {}

export const MeldingForm = ({
  defaultValues,
  existingId,
  existingMelding,
  existingToken,
  labels,
  primaryTextArea,
  sources,
}: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const t = useTranslations('melding-form')

  const requiredErrorMessage =
    primaryTextArea.validate?.required_error_message ?? t('errors.required-error-message-fallback')
  const action = postMeldingForm.bind(null, { existingId, existingToken, requiredErrorMessage })

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(action, initialState)
  const [prefetchedMelding, setPrefetchedMelding] = useState<MeldingData | null>(existingMelding ?? null)

  const { labelsDefaultValues, primaryDefaultValue, sourceDefaultValue, urgencyDefaultValue } = calculateDefaultValues(
    formData,
    defaultValues,
  )

  // Set focus on InvalidFormAlert when there are validation errors
  // and on SystemErrorAlert when there is a system error
  useEffect(() => {
    if (validationErrors && invalidFormAlertRef.current) {
      invalidFormAlertRef.current.focus()
    } else if (systemError && systemErrorAlertRef.current) {
      systemErrorAlertRef.current.focus()
    }
  }, [validationErrors, systemError])

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  const primaryErrorMessage = validationErrors?.find((error) => error.key === 'primary')?.message
  const sourceErrorMessage = validationErrors?.find((error) => error.key === 'source')?.message

  return (
    <Grid as="main" className={`ams-page__area--body ${styles.main}`} gapVertical="large" paddingVertical="x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
        {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
        {validationErrors && <InvalidFormAlert ref={invalidFormAlertRef} validationErrors={validationErrors} />}
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <Form action={formAction} noValidate>
          <Column>
            <PrimaryField
              config={primaryTextArea}
              defaultValue={primaryDefaultValue}
              errorMessage={primaryErrorMessage}
              existingId={prefetchedMelding?.id ?? existingId}
              existingToken={prefetchedMelding?.token ?? existingToken}
              onMeldingPrefetched={setPrefetchedMelding}
            />
            {prefetchedMelding?.classificationName && (
              <Paragraph>De categorie van de melding is: {prefetchedMelding.classificationName}</Paragraph>
            )}
            {prefetchedMelding && (
              <input name="prefetchedMelding" type="hidden" value={JSON.stringify(prefetchedMelding)} />
            )}
            <SourceField defaultValue={sourceDefaultValue} errorMessage={sourceErrorMessage} sources={sources} />
            <UrgencyField defaultValue={urgencyDefaultValue} />
            <LabelsField defaultValues={labelsDefaultValues} labels={labels} />
            <Button className={styles.submit} type="submit">
              {t('submit-button')}
            </Button>
          </Column>
        </Form>
      </Grid.Cell>
    </Grid>
  )
}
