'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'

import { postPrimaryForm } from './actions'

const initialState: { errorMessage?: string; formData?: FormData } = {}

export const Home = ({ formComponents }: { formComponents: StaticFormTextAreaComponentOutput[] }) => {
  const [{ formData, errorMessage }, formAction] = useActionState(postPrimaryForm, initialState)
  const [prefilledFormComponents, setPrefilledFormComponents] = useState(formComponents)

  const t = useTranslations('homepage')

  useEffect(() => {
    if (formData) {
      const prefilledFormComponents = formComponents.map((component) => {
        const formValue = formData.get(component.key)

        if (formValue) {
          return { ...component, defaultValue: formValue }
        }

        return component
      })

      return setPrefilledFormComponents(prefilledFormComponents)
    }
  }, [formData])

  return (
    <>
      {errorMessage && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{errorMessage}</Paragraph>
        </Alert>
      )}
      <FormRenderer
        action={formAction}
        formComponents={prefilledFormComponents}
        submitButtonText={t('submit-button')}
      />
    </>
  )
}
