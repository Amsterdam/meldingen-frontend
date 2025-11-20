'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'

import type { Component } from '@meldingen/form-renderer'

import { FormRenderer, isSelectboxes } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import { BackLink } from '../../../_components/BackLink/BackLink'
import { FormHeader } from '../../../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../../../_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from '../../../_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from '../../../_utils/useSetFocusOnInvalidFormAlert'
import { FormState, ValidationError } from 'apps/melding-form/src/types'

const getPrefilledFormComponents = (components: Component[], formData: FormData): Component[] =>
  components.map((component) => {
    if (isSelectboxes(component)) {
      const defaultValues = component.values.map(({ value }) => formData.get(`checkbox___${component.key}___${value}`))

      return { ...component, defaultValues }
    }

    const formValue = formData.get(component.key)

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

export const AdditionalQuestions = ({
  action,
  formComponents: formComponentsFromServer,
  panelLabel,
  previousPanelPath,
}: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(action, initialState)

  const t = useTranslations('additional-questions')
  const tShared = useTranslations('shared')

  /**
   * Form components can be prefilled on load on the server, where we fill in existing answers from the backend,
   * or in case of an error, where we use the form data provided.
   * If there is form data, it should take priority over the prefilled components from the server.
   */
  const formComponents = formData
    ? getPrefilledFormComponents(formComponentsFromServer, formData)
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
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-s" href={previousPanelPath}>
        {t('back-link')}
      </BackLink>
      <main>
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
        <FormHeader step={t('step')} title={t('title')} />
        <FormRenderer
          action={formAction}
          formComponents={formComponents}
          panelLabel={panelLabel}
          submitButtonText={t('submit-button')}
          validationErrors={validationErrors}
        />
      </main>
    </>
  )
}
