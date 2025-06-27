'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, useActionState, useEffect, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'

import { postPrimaryForm } from './actions'

type AllFormInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const initialState: { message?: string } = {}

export const Home = ({ formData }: { formData: StaticFormTextAreaComponentOutput[] }) => {
  const [formState, formAction] = useActionState(postPrimaryForm, initialState)
  const [prefilledFormData, setPrefilledData] = useState(formData)

  const t = useTranslations('homepage')

  const onChange = (event: ChangeEvent<AllFormInputs>) => {
    if (event.target.value) {
      localStorage.setItem(`${event.target.id}`, JSON.stringify(event.target.value))
    }
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
      {formState?.message && <Paragraph>{formState.message}</Paragraph>}
      <FormRenderer
        action={formAction}
        formData={prefilledFormData}
        submitButtonText={t('submit-button')}
        onChange={onChange}
      />
    </>
  )
}
