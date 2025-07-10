'use client'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'

import { postPrimaryForm } from './actions'

const initialState: { message?: string } = {}

export const Home = ({ formData }: { formData: StaticFormTextAreaComponentOutput[] }) => {
  const [formState, formAction] = useActionState(postPrimaryForm, initialState)
  const [prefilledFormData, setPrefilledData] = useState(formData)

  const t = useTranslations('homepage')

  const handleChange = (value: string | string[], name: string) => {
    localStorage.setItem(name, JSON.stringify(value))
  }

  useEffect(() => {
    const prefilledFormData = formData.map((component) => {
      const localStorageData = localStorage.getItem(component.key)

      if (localStorageData) {
        return { ...component, defaultValue: JSON.parse(localStorageData) }
      }

      return component
    })

    return setPrefilledData(prefilledFormData)
  }, [])

  return (
    <>
      {formState?.message && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{formState.message}</Paragraph>
        </Alert>
      )}
      <FormRenderer
        action={formAction}
        formData={prefilledFormData}
        submitButtonText={t('submit-button')}
        onChange={handleChange}
      />
    </>
  )
}
