'use client'

import { Button, Grid, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useState, useTransition } from 'react'

import type {
  ClassificationOutput,
  LabelOutput,
  SourceOutput,
  StaticFormTextAreaComponentOutput,
} from '@meldingen/api-client'

import { Column, Paragraph } from '@meldingen/ui'

import type { MeldingData } from './types'
import type { FormState } from '~/types'

import { useDocumentTitleOnError } from '../_utils/useDocumentTitleOnError'
import { ClassificationField, LabelsField, NoteField, PrimaryField, SourceField, UrgencyField } from './_components'
import { postMeldingForm } from './actions'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'

import styles from './MeldingForm.module.css'

type Props = {
  classifications: ClassificationOutput[]
  defaultValues?: {
    classificationQuery?: string
    labels?: number[]
    note?: string
    primary?: string
    source?: string
    urgency?: number
  }
  existingId?: number
  existingMelding?: MeldingData
  existingNoteId?: number
  existingToken?: string
  labels: LabelOutput[]
  primaryTextArea: StaticFormTextAreaComponentOutput
  sources: SourceOutput[]
}

// Form data from a failed submission takes priority over server-provided defaults.
const calculateDefaultValues = (formData?: FormData, defaultValues?: Props['defaultValues']) => {
  const primaryDefaultValue = (formData?.get('primary') as string | null) ?? defaultValues?.primary ?? ''
  const classificationQueryDefaultValue =
    (formData?.get('classificationQuery') as string | null) ?? defaultValues?.classificationQuery
  const sourceDefaultValue = (formData?.get('source') as string | null) ?? defaultValues?.source ?? ''
  const labelsDefaultValues = formData?.getAll('labels').map((label) => Number(label)) ?? defaultValues?.labels ?? []
  const rawUrgency = formData?.get('urgency')
  const urgencyDefaultValue =
    rawUrgency !== null && rawUrgency !== undefined ? Number(rawUrgency) : (defaultValues?.urgency ?? 0)
  const noteDefaultValue = (formData?.get('addNote') as string | null) ?? defaultValues?.note ?? ''

  return {
    classificationQueryDefaultValue,
    labelsDefaultValues,
    noteDefaultValue,
    primaryDefaultValue,
    sourceDefaultValue,
    urgencyDefaultValue,
  }
}

const initialState: FormState = {}

export const MeldingForm = ({
  classifications,
  defaultValues,
  existingId,
  existingMelding,
  existingNoteId,
  existingToken,
  labels,
  primaryTextArea,
  sources,
}: Props) => {
  const t = useTranslations('melding-form')

  const requiredErrorMessage =
    primaryTextArea.validate?.required_error_message ?? t('errors.required-error-message-fallback')

  const postMeldingFormAction = postMeldingForm.bind(null, {
    existingId,
    existingNoteId,
    existingToken,
    requiredErrorMessage,
  })

  const [isPrefetching, startPrefetchingTransition] = useTransition()

  const [{ apiError, formData, validationErrors }, formAction, isPending] = useActionState(
    postMeldingFormAction,
    initialState,
  )

  const [prefetchedMelding, setPrefetchedMelding] = useState<MeldingData | null>(existingMelding ?? null)

  // Update document title when there are validation errors or an API error
  const documentTitle = useDocumentTitleOnError({
    baseDocumentTitle: t('metadata.title'),
    hasApiError: Boolean(apiError),
    validationErrorCount: validationErrors?.length ?? undefined,
  })

  useEffect(() => {
    if (apiError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(apiError)
    }
  }, [apiError])

  const {
    classificationQueryDefaultValue,
    labelsDefaultValues,
    noteDefaultValue,
    primaryDefaultValue,
    sourceDefaultValue,
    urgencyDefaultValue,
  } = calculateDefaultValues(formData, defaultValues)

  const classificationDefaultValue = classificationQueryDefaultValue ?? prefetchedMelding?.classificationName ?? ''

  const primaryErrorMessage = validationErrors?.find((error) => error.key === 'primary')?.message
  const sourceErrorMessage = validationErrors?.find((error) => error.key === 'source')?.message
  const noteErrorMessage = validationErrors?.find((error) => error.key === 'addNote')?.message
  const classificationQueryErrorMessage = validationErrors?.find(
    (error) => error.key === 'classificationQuery',
  )?.message
  const classificationIdErrorMessage = validationErrors?.find((error) => error.key === 'classificationId')?.message

  return (
    <Grid
      as="main"
      className={`ams-theme ams-page__area--body ${styles.main}`}
      gapVertical="large"
      paddingVertical="x-large"
    >
      <title>{documentTitle}</title>
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        {Boolean(apiError) && <ApiErrorAlert shouldFocus={!isPending} />}
        {validationErrors && <InvalidFormAlert errors={validationErrors} shouldFocus={!isPending} />}

        <Heading className="ams-mb-m ams-visually-hidden" level={1}>
          {t('visually-hidden-title')}
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
              startPrefetchingTransition={startPrefetchingTransition}
            />

            {prefetchedMelding?.classificationName && (
              <Paragraph>De categorie van de melding is: {prefetchedMelding.classificationName}</Paragraph>
            )}

            {prefetchedMelding && (
              <input name="prefetchedMelding" type="hidden" value={JSON.stringify(prefetchedMelding)} />
            )}

            <ClassificationField
              classifications={classifications}
              derivedClassification={classificationDefaultValue}
              errorMessage={classificationQueryErrorMessage ?? classificationIdErrorMessage}
              isDisabled={isPrefetching}
            />

            <SourceField defaultValue={sourceDefaultValue} errorMessage={sourceErrorMessage} sources={sources} />
            <UrgencyField defaultValue={urgencyDefaultValue} />
            <LabelsField defaultValues={labelsDefaultValues} labels={labels} />
            <NoteField defaultValue={noteDefaultValue} errorMessage={noteErrorMessage} />

            <Button className={styles.submit} disabled={isPending} type="submit">
              {t('submit-button')}
            </Button>
          </Column>
        </Form>
      </Grid.Cell>
    </Grid>
  )
}
