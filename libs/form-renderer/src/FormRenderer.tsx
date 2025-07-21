import { Heading, SubmitButton } from '@meldingen/ui'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'
import type { Component } from './types'
import { isRadio, isSelect, isSelectboxes, isTextarea, isTextfield } from './utils'

const getComponent = (component: Component, hasOneFormComponent: boolean) => {
  if (isRadio(component)) {
    const { defaultValue, description, key, label, validate, values } = component
    return (
      <Radio
        defaultValue={defaultValue}
        description={description}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        label={label}
        validate={validate}
        values={values}
      />
    )
  }
  if (isSelect(component)) {
    const { defaultValue, description, key, label, validate, data } = component
    return (
      <Select
        data={data}
        defaultValue={defaultValue}
        description={description}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        label={label}
        validate={validate}
      />
    )
  }
  if (isSelectboxes(component)) {
    const { defaultValues, description, key, label, validate, values } = component
    return (
      <Checkbox
        defaultValues={defaultValues}
        description={description}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        label={label}
        validate={validate}
        values={values}
      />
    )
  }
  if (isTextarea(component)) {
    const { defaultValue, description, key, label, validate, maxCharCount } = component
    return (
      <TextArea
        defaultValue={defaultValue}
        description={description}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        label={label}
        maxCharCount={maxCharCount}
        validate={validate}
      />
    )
  }

  if (isTextfield(component)) {
    const { defaultValue, description, key, label, validate } = component
    return (
      <TextInput
        defaultValue={defaultValue}
        description={description}
        hasHeading={hasOneFormComponent}
        id={key}
        key={key}
        label={label}
        validate={validate}
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
}

export const FormRenderer = ({ action, formComponents, panelLabel, submitButtonText }: Props) => {
  const hasOneFormComponent = formComponents.length === 1
  return (
    <>
      {/*
       * If the page has only one form component, an h1 gets added to the label or legend of that component.
       * If the page has more than one form component, the h1 is rendered here.
       */}
      {!hasOneFormComponent && panelLabel && (
        <Heading level={1} size="level-4" className="ams-mb-m">
          {panelLabel}
        </Heading>
      )}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <form className="ams-gap-m" action={action}>
        {formComponents.map((component) => getComponent(component, hasOneFormComponent))}
        <SubmitButton>{submitButtonText}</SubmitButton>
      </form>
    </>
  )
}
