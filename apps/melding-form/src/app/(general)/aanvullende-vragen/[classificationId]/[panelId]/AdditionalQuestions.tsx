'use client'

import { Alert, Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'

import { FormRenderer } from '@meldingen/form-renderer'

// TODO: fix types
type Props = {
  action: any
  formData: any[]
  previousPanelPath: string
}

const initialState: { message?: string } = {}

export const AdditionalQuestions = ({ action, formData }: Props) => {
  const [formState, formAction] = useActionState(action, initialState)
  const [prefilledFormData, setPrefilledData] = useState(formData)

  const t = useTranslations('additional-questions')

  const handleChange = (value: string | string[], name: string) => {
    localStorage.setItem(`${name}`, JSON.stringify(value))
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
      <Heading level={1}>{t('step.title')}</Heading>
      <FormRenderer
        formData={prefilledFormData}
        action={formAction}
        submitButtonText={t('submit-button')}
        onChange={handleChange}
      />
    </>
  )
}
