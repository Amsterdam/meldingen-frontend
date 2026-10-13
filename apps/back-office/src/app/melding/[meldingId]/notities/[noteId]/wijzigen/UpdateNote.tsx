'use client'

import { ActionGroup, Button, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect } from 'react'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import type { FormState } from '~/types'

import { CancelLink } from '../../../_components/CancelLink'
import { PageWrapper } from '../../../_components/PageWrapper'
import { postUpdateNoteForm } from './actions'
import { ApiErrorAlert, InvalidFormAlert, RichTextEditor } from '~/app/_components'
import { useDocumentTitleOnError } from '~/app/_utils/useDocumentTitleOnError'

import styles from './UpdateNote.module.css'

const initialState: FormState = {}

type Props = {
  meldingId: number
  note: NoteRetrieveOutput
}

export const UpdateNote = ({ meldingId, note }: Props) => {
  const action = postUpdateNoteForm.bind(null, { meldingId, noteId: note.id })

  const [{ apiError, formData, validationErrors }, formAction, isPending] = useActionState(action, initialState)

  const t = useTranslations('update-note')

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

  const defaultValue = formData?.get('updateNote')?.toString() ?? note.text
  const errorMessage = validationErrors?.find((error) => error.key === 'updateNote')?.message

  return (
    <PageWrapper backLink={{ href: `/melding/${meldingId}`, label: t('back-link') }} documentTitle={documentTitle}>
      {Boolean(apiError) && <ApiErrorAlert shouldFocus={!isPending} />}
      {validationErrors && (
        <InvalidFormAlert errors={validationErrors} heading={t('invalid-form-alert-title')} shouldFocus={!isPending} />
      )}
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      <Form action={formAction} noValidate>
        <div className={styles.whiteField}>
          <RichTextEditor
            defaultValue={defaultValue}
            errorMessage={errorMessage}
            id="updateNote"
            label={t('label')}
            labelClassName="ams-mb-s"
            name="updateNote"
          />
        </div>
        <ActionGroup>
          <Button type="submit">{t('submit-button')}</Button>
          <CancelLink href={`/melding/${meldingId}`}>{t('cancel-link')}</CancelLink>
        </ActionGroup>
      </Form>
    </PageWrapper>
  )
}
