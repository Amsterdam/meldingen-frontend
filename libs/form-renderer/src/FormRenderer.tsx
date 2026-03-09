'use client'

import Form from 'next/form'
import { useEffect, useState } from 'react'

import { Heading, SubmitButton } from '@meldingen/ui'

import type { Component } from './types'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'
import { isRadio, isSelect, isSelectboxes, isTextarea, isTextfield, isVisible } from './utils'

const getDefaultValue = (component: Component): string | string[] => {
  if (isSelectboxes(component)) return component.value ?? []
  return component.value ?? ''
}

const getComponent = (
  component: Component,
  hasOneFormComponent: boolean,
  value: string | string[],
  onChange: (value: string | string[]) => void,
  errorMessage?: string,
) => {
  const { key } = component
  if (isRadio(component)) {
    return (
      <Radio
        {...component}
        errorMessage={errorMessage}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        onChange={onChange as (value: string) => void}
        value={value as string}
      />
    )
  }
  if (isSelect(component)) {
    return (
      <Select
        {...component}
        errorMessage={errorMessage}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        onChange={onChange as (value: string) => void}
        value={value as string}
      />
    )
  }
  if (isSelectboxes(component)) {
    return (
      <Checkbox
        {...component}
        errorMessage={errorMessage}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        onChange={onChange as (value: string[]) => void}
        value={value as string[]}
      />
    )
  }
  if (isTextarea(component)) {
    return (
      <TextArea
        {...component}
        errorMessage={errorMessage}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        onChange={onChange as (value: string) => void}
        value={value as string}
      />
    )
  }
  if (isTextfield(component)) {
    return (
      <TextInput
        {...component}
        errorMessage={errorMessage}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        onChange={onChange as (value: string) => void}
        value={value as string}
      />
    )
  }
  // eslint-disable-next-line no-console
  console.error(`Type ${component.type} is unknown, please add it to FormRenderer.`)
  return undefined
}

export type Props = {
  action: (formData: FormData) => void
  formComponents: Component[]
  panelLabel?: string
  submitButtonText: string
  validationErrors?: {
    key: string
    message: string
  }[]
}

export const FormRenderer = ({ action, formComponents, panelLabel, submitButtonText, validationErrors }: Props) => {
  const hasOneFormComponent = formComponents.length === 1

  const [values, setValues] = useState<Record<string, string | string[]>>(() =>
    Object.fromEntries(formComponents.map((component) => [component.key, getDefaultValue(component)])),
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/*
       * If the page has only one form component, an h1 gets added to the label or legend of that component.
       * If the page has more than one form component, the h1 is rendered here.
       */}
      {!hasOneFormComponent && panelLabel && (
        <Heading className="ams-mb-m" level={1} size="level-3">
          {panelLabel}
        </Heading>
      )}
      <Form action={action} className="ams-gap-m" noValidate>
        {formComponents.map((component) => {
          if (mounted && !isVisible(component, values)) return null

          const errorMessage = validationErrors?.find((error) => error.key === component.key)?.message
          const onChange = (newValue: string | string[]) =>
            setValues((prev) => ({ ...prev, [component.key]: newValue }))

          return getComponent(component, hasOneFormComponent, values[component.key], onChange, errorMessage)
        })}
        <SubmitButton>{submitButtonText}</SubmitButton>
      </Form>
    </>
  )
}
