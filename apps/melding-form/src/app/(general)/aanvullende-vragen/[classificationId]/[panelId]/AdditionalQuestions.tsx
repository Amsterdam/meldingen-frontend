'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'

import { FormRenderer, isSelectboxes } from '@meldingen/form-renderer'
import type { Component } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import { BackLink } from '../../../_components/BackLink/BackLink'
import { FormHeader } from '../../../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../../../_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from '../../../_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from '../../../_utils/useSetFocusOnInvalidFormAlert'
import { FormState, ValidationError } from 'apps/melding-form/src/types'

const getPrefilledFormComponents = (components: Component[], formData?: FormData): Component[] =>
  components.map((component) => {
    // Prefill checkboxes if no defaultValues are set
    if (isSelectboxes(component) && !component.defaultValues) {
      const defaultValues = component.values.map(({ value }) => formData?.get(`checkbox___${component.key}___${value}`))

      return { ...component, defaultValues }
    }

    const formValue = formData?.get(component.key)

    if (typeof formValue === 'string') {
      return { ...component, defaultValue: formValue }
    }

    return component
  })

const mapValidationErrors = (errors: ValidationError[]) =>
  errors.map((validationError) => ({
    id: `#${validationError.key}`,
    label: validationError.message,
  }))

export type Props = {
  action: (_: unknown, formData: FormData) => Promise<FormState>
  formComponents: Component[]
  panelLabel: string
  previousPanelPath: string
}

const initialState: FormState = {}

export const AdditionalQuestions = ({ action, formComponents, panelLabel, previousPanelPath }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(action, initialState)

  const t = useTranslations('additional-questions')
  const tShared = useTranslations('shared')

  const prefilledFormComponents = getPrefilledFormComponents(formComponents, formData)

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
      <BackLink className="ams-mb-s" href={previousPanelPath}>
        {t('back-link')}
      </BackLink>
      <main>
        <title>{documentTitle}</title>
        {Boolean(systemError) && <SystemErrorAlert />}
        {validationErrors && (
          <InvalidFormAlert
            className="ams-mb-m"
            errors={mapValidationErrors(validationErrors)}
            heading={tShared('invalid-form-alert-title')}
            headingLevel={2}
            ref={invalidFormAlertRef}
          />
        )}
        <FormHeader title={t('title')} step={t('step')} />
        <FormRenderer
          formComponents={prefilledFormComponents}
          action={formAction}
          panelLabel={panelLabel}
          submitButtonText={t('submit-button')}
          validationErrors={validationErrors}
        />
      </main>
    </>
  )
}
