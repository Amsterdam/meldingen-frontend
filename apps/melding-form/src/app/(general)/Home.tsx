'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import { FormHeader } from './_components/FormHeader/FormHeader'
import { postPrimaryForm } from './actions'
import { FormState } from '../../types'
import { getDocumentTitleOnError } from './_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from './_utils/useSetFocusOnInvalidFormAlert'

const initialState: FormState = {}

export const Home = ({ formComponents }: { formComponents: StaticFormTextAreaComponentOutput[] }) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(postPrimaryForm, initialState)

  const t = useTranslations('homepage')
  const tShared = useTranslations('shared')

  const prefilledFormComponents = formComponents.map((component) => {
    const formValue = formData?.get(component.key)

    if (typeof formValue === 'string') {
      return { ...component, defaultValue: formValue }
    }

    return component
  })

  // Set focus on InvalidFormAlert when there are validation errors
  useSetFocusOnInvalidFormAlert(invalidFormAlertRef, validationErrors)

  // Update document title when there are validation errors
  const documentTitle = getDocumentTitleOnError(t('metadata.title'), tShared, validationErrors)

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  return (
    <>
      <title>{documentTitle}</title>
      {systemError && (
        <Alert
          role="alert"
          headingLevel={2}
          severity="error"
          heading={tShared('system-error-alert-title')}
          className="ams-mb-xl"
        >
          <Paragraph>{tShared('system-error-alert-description')}</Paragraph>
        </Alert>
      )}
      {validationErrors && (
        <InvalidFormAlert
          className="ams-mb-m"
          errors={validationErrors.map((error) => ({
            id: `#${error.key}`,
            label: error.message,
          }))}
          heading={tShared('invalid-form-alert-title')}
          headingLevel={2}
          ref={invalidFormAlertRef}
        />
      )}
      <FormHeader title={t('title')} step={t('step')} />
      <FormRenderer
        action={formAction}
        formComponents={prefilledFormComponents}
        submitButtonText={t('submit-button')}
        validationErrors={validationErrors}
      />
    </>
  )
}
