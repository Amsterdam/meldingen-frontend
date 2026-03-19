import Form from 'next/form'
import { useState } from 'react'

import { Heading, SubmitButton } from '@meldingen/ui'

import type { AnswersByKey, Component } from './types'

import { Checkbox, Radio, Select, TextArea, TextInput, TimeInput } from './components'
import { isRadio, isSelect, isSelectboxes, isTextarea, isTextfield, isTimeInput, shouldRender } from './utils'

import styles from './FormRenderer.module.css'

const getValue = (component: Component): string | string[] => {
  if (isSelectboxes(component)) return component.defaultValues ?? []
  return component.defaultValue ?? ''
}

const getComponent = (
  component: Component,
  hasOneFormComponent: boolean,
  onChange: (value: string | string[]) => void,
  errorMessage?: string,
) => {
  const onChangeString = (value: string) => onChange(value)
  const onChangeArray = (value: string[]) => onChange(value)

  const { key } = component
  if (isRadio(component)) {
    return (
      <Radio
        {...component}
        errorMessage={errorMessage}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        onChange={onChangeString}
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
        onChange={onChangeString}
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
        onChange={onChangeArray}
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
        onChange={onChangeString}
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
        onChange={onChangeString}
      />
    )
  }
  if (isTimeInput(component)) {
    return (
      <TimeInput
        {...component}
        errorMessage={errorMessage}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        onChange={onChangeString}
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
  panelTitle?: string
  previousAnswersByKey?: AnswersByKey
  submitButtonText: string
  validationErrors?: {
    key: string
    message: string
  }[]
}

export const FormRenderer = ({
  action,
  formComponents,
  panelTitle,
  previousAnswersByKey = {},
  submitButtonText,
  validationErrors,
}: Props) => {
  const hasOneFormComponent = formComponents.length === 1

  // These values track the user's answers so we can show/hide components conditionally.
  // The form inputs themselves are uncontrolled; we don't use this state to set input values.
  const [values, setValues] = useState<AnswersByKey>(() => {
    const initialComponentValues = Object.fromEntries(
      formComponents.map((component) => [component.key, getValue(component)]),
    )

    return { ...previousAnswersByKey, ...initialComponentValues }
  })

  return (
    <>
      {/*
       * If the page has only one form component, an h1 gets added to the label or legend of that component.
       * If the page has more than one form component, the h1 is rendered here.
       */}
      {!hasOneFormComponent && panelTitle && (
        <Heading className="ams-mb-xl" level={1} size="level-3">
          {panelTitle}
        </Heading>
      )}
      <Form action={action} className={styles.form} noValidate>
        {formComponents.map((component) => {
          if (!shouldRender(component, values)) return null

          const errorMessage = validationErrors?.find((error) => error.key === component.key)?.message

          const onChange = (newValue: string | string[]) =>
            setValues((prev) => ({ ...prev, [component.key]: newValue }))

          return getComponent(component, hasOneFormComponent, onChange, errorMessage)
        })}
        <SubmitButton>{submitButtonText}</SubmitButton>
      </Form>
    </>
  )
}
