'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'

import { FormRenderer, StaticFormTextAreaComponent } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import type { FormState } from '../../types'

import { FormHeader } from './_components/FormHeader/FormHeader'
import { SystemErrorAlert } from './_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from './_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from './_utils/useSetFocusOnInvalidFormAlert'

const initialState: FormState = {}

type Props = {
  action: (_: unknown, formData: FormData) => Promise<FormState>
  formComponents: StaticFormTextAreaComponent[]
}

export const Home = ({ action, formComponents: formComponentsFromServer }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(action, initialState)

  const t = useTranslations('homepage')
  const tShared = useTranslations('shared')

  /**
   * Form components can be prefilled on load on the server, where we fill in existing answers from the backend,
   * or in case of an error, where we use the form data provided.
   * If there is form data, it should take priority over the prefilled components from the server.
   */
  const formComponents = formData
    ? formComponentsFromServer.map((component) => {
        const formValue = formData.get(component.key)

        if (typeof formValue === 'string') {
          return { ...component, defaultValue: formValue }
        }

        return component
      })
    : formComponentsFromServer

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
    <main>
      <title>{documentTitle}</title>
      {Boolean(systemError) && <SystemErrorAlert />}
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
      <FormHeader step={t('step')} title={t('title')} />
      <FormRenderer
        action={formAction}
        formComponents={formComponents}
        submitButtonText={t('submit-button')}
        validationErrors={validationErrors}
      />
    </main>
  )
}
