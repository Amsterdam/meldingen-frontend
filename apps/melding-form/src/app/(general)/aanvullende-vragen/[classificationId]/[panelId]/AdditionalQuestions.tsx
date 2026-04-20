'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'

import type { Component } from '@meldingen/form-renderer'

import { FormRenderer, isSelectboxes, isTimeInput } from '@meldingen/form-renderer'
import { InvalidFormAlert } from '@meldingen/ui'

import type { AnswersByKey } from '../../../_utils/conditions/getFilteredAnswersByKey'
import type { FormState, ValidationError } from 'apps/melding-form/src/types'

import { SystemErrorAlert } from '../../../_components/SystemErrorAlert'
import { getDocumentTitleOnError } from '../../../_utils/validation/getDocumentTitleOnError'
import { BackLink } from 'apps/melding-form/src/app/_components'

const getPrefilledFormComponents = (components: Component[], formData: FormData): Component[] =>
  components.map((component) => {
    if (isSelectboxes(component)) {
      const defaultValues = component.values.map(({ value }) => formData.get(`checkbox___${component.key}___${value}`))

      return { ...component, defaultValues }
    }

    if (isTimeInput(component)) {
      if (formData.get(`time___${component.key}-unknown`) === 'on') {
        return { ...component, defaultValue: null }
      }
      const timeValue = formData.get(`time___${component.key}`)
      if (typeof timeValue === 'string') {
        return { ...component, defaultValue: timeValue }
      }
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
  panelTitle: string
  previousAnswersByKey: AnswersByKey
  previousPanelPath: string
}

const initialState: FormState = {}

const getPrimaryHeading = (components: Component[], panelTitle: string) => {
  if (components.length === 1) {
    return components[0].label
  }

  return panelTitle
}

export const AdditionalQuestions = ({
  action,
  formComponents: formComponentsFromServer,
  panelTitle,
  previousAnswersByKey,
  previousPanelPath,
}: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

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

  // Update document title when there are system or validation errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(systemError),
    originalDocTitle: `${getPrimaryHeading(formComponents, panelTitle)} - ${tShared('organisation-name')}`,
    translateFunction: tShared,
    validationErrorCount: validationErrors?.length,
  })

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

  return (
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-m" href={previousPanelPath}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
        {validationErrors && (
          <InvalidFormAlert
            className="ams-mb-m"
            errors={mapValidationErrors(validationErrors)}
            heading={tShared('invalid-form-alert-title')}
            headingLevel={2}
            ref={invalidFormAlertRef}
          />
        )}
        <FormRenderer
          action={formAction}
          formComponents={formComponents}
          panelTitle={panelTitle}
          previousAnswersByKey={previousAnswersByKey}
          submitButtonText={t('submit-button')}
          validationErrors={validationErrors}
        />
      </main>
    </>
  )
}
