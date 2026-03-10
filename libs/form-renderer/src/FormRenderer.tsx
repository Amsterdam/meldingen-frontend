import Form from 'next/form'
import { useEffect, useState } from 'react'

import { Heading, SubmitButton } from '@meldingen/ui'

import type { Component } from './types'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'
import { isRadio, isSelect, isSelectboxes, isTextarea, isTextfield, isVisible } from './utils'

const getValue = (component: Component): string | string[] => {
  if (isSelectboxes(component)) return component.defaultValues ?? []
  return component.defaultValue ?? ''
}

const getComponent = (
  component: Component,
  hasOneFormComponent: boolean,
  errorMessage?: string,
  onChange?: (value: string | string[]) => void,
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
    Object.fromEntries(formComponents.map((component) => [component.key, getValue(component)])),
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

          return getComponent(component, hasOneFormComponent, errorMessage, onChange)
        })}
        <SubmitButton>{submitButtonText}</SubmitButton>
      </Form>
    </>
  )
}
