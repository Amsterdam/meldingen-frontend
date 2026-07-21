'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useEffect } from 'react'

import type { Component } from '@meldingen/form-renderer'

import { FormRenderer, isSelectboxes, isTimeInput } from '@meldingen/form-renderer'

import type { AnswersByKey } from '../../../_utils/conditions'
import type { FormState } from '~/types'

import { getDocumentTitleOnError } from '../../../_utils/validation'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'
import { BackLink } from '~/app/_components'

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
  const [{ apiError, formData, validationErrors }, formAction, isPending] = useActionState(action, initialState)

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

  // Update document title when there are API or validation errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(apiError),
    originalDocTitle: `${getPrimaryHeading(formComponents, panelTitle)} - ${tShared('organisation-name')}`,
    translateFunction: tShared,
    validationErrorCount: validationErrors?.length,
  })

  useEffect(() => {
    if (apiError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(apiError)
    }
  }, [apiError])

  return (
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-m" href={previousPanelPath}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(apiError) && <ApiErrorAlert shouldRefocus={!isPending} />}
        {validationErrors && <InvalidFormAlert errors={validationErrors} shouldFocus={!isPending} />}
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
