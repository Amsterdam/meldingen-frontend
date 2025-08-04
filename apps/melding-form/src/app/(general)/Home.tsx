'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import { FormHeader } from './_components/FormHeader/FormHeader'
import { postPrimaryForm } from './actions'
import { FormState } from '../../types'

const initialState: FormState = {}

export const Home = ({ formComponents }: { formComponents: StaticFormTextAreaComponentOutput[] }) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ formData, errorMessage, validationErrors }, formAction] = useActionState(postPrimaryForm, initialState)

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
  useEffect(() => {
    if (invalidFormAlertRef.current && validationErrors) {
      invalidFormAlertRef.current.focus()
    }
  }, [validationErrors])

  // Update document title when there are validation errors
  const [documentTitle, setDocumentTitle] = useState(t('metadata.title'))

  useEffect(() => {
    if (validationErrors) {
      const errorCount = validationErrors.length

      setDocumentTitle(`${tShared('error-count-label', { count: errorCount })} ${t('metadata.title')}`)
    }
  }, [validationErrors])

  return (
    <>
      <title>{documentTitle}</title>
      {errorMessage && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{errorMessage}</Paragraph>
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
      />
    </>
  )
}
