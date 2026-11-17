'use client'

import type { ReactNode } from 'react'

import { ActionGroup, Button, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect } from 'react'

import type { FormState } from '~/types'

import { CancelLink } from '../../../_components/CancelLink'
import { PageWrapper } from '../../../_components/PageWrapper'
import { ApiErrorAlert, InvalidFormAlert, RichTextEditor } from '~/app/_components'
import { useDocumentTitleOnError } from '~/app/_utils/useDocumentTitleOnError'

import styles from './NoteForm.module.css'

const initialState: FormState = {}

type Props = {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>
  // Rendered between the heading and the form, e.g. the note that is being replied to.
  children?: ReactNode
  defaultValue?: string
  fieldName: string
  meldingId: number
  required?: boolean
  // All note forms share the same translation keys, only the namespace differs.
  translationNamespace: 'add-note' | 'react-note' | 'update-note'
}

export const NoteForm = ({
  action,
  children,
  defaultValue = '',
  fieldName,
  meldingId,
  required,
  translationNamespace,
}: Props) => {
  const [{ apiError, formData, validationErrors }, formAction, isPending] = useActionState(action, initialState)

  const t = useTranslations(translationNamespace)

  useDocumentTitleOnError({
    hasApiError: Boolean(apiError),
    validationErrorCount: validationErrors?.length,
  })

  useEffect(() => {
    if (apiError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(apiError)
    }
  }, [apiError])

  const editorValue = formData?.get(fieldName)?.toString() ?? defaultValue
  const errorMessage = validationErrors?.find((error) => error.key === fieldName)?.message

  return (
    <PageWrapper backLink={{ href: `/melding/${meldingId}`, label: t('back-link') }}>
      {Boolean(apiError) && <ApiErrorAlert focusKey={!isPending} />}
      {validationErrors && (
        <InvalidFormAlert errors={validationErrors} focusKey={!isPending} heading={t('invalid-form-alert-title')} />
      )}
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      {children}
      <Form action={formAction} noValidate>
        <div className={styles.whiteField}>
          <RichTextEditor
            defaultValue={editorValue}
            errorMessage={errorMessage}
            id={fieldName}
            label={t('label')}
            labelClassName="ams-mb-s"
            name={fieldName}
            required={required}
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
