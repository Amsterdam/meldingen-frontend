'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import { FormHeader } from './_components/FormHeader/FormHeader'
import { postPrimaryForm } from './actions'
import { FormState } from '../../types'
import { SystemErrorAlert } from './_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from './_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from './_utils/useSetFocusOnInvalidFormAlert'

const initialState: FormState = {}

type Props = {
  formComponents: StaticFormTextAreaComponentOutput[]
  id?: string
  token?: string
}

export const Home = ({ formComponents, id, token }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const postPrimaryFormWithIsExistingMelding = postPrimaryForm.bind(null, { existingId: id, existingToken: token })

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(
    postPrimaryFormWithIsExistingMelding,
    initialState,
  )

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
      {systemError && <SystemErrorAlert />}
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
