'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useEffect } from 'react'

import type { StaticFormTextAreaComponent } from '@meldingen/form-renderer'

import { FormRenderer } from '@meldingen/form-renderer'

import type { FormState } from '~/types'

import { getDocumentTitleOnError } from './_utils/validation'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'

const initialState: FormState = {}

type Props = {
  action: (_: unknown, formData: FormData) => Promise<FormState>
  formComponents: StaticFormTextAreaComponent[]
}

export const Home = ({ action, formComponents: formComponentsFromServer }: Props) => {
  const [{ apiError, formData, validationErrors }, formAction, isPending] = useActionState(action, initialState)

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

  // Update document title when there are API or validation errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(apiError),
    originalDocTitle: `${formComponents[0].label} - ${tShared('organisation-name')}`,
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
    <main>
      <title>{documentTitle}</title>
      {Boolean(apiError) && <ApiErrorAlert shouldRefocus={!isPending} />}
      {validationErrors && <InvalidFormAlert errors={validationErrors} />}
      <FormRenderer
        action={formAction}
        formComponents={formComponents}
        submitButtonText={t('submit-button')}
        validationErrors={validationErrors}
      />
    </main>
  )
}
