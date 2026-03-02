import Form from 'next/form'

import { Heading, SubmitButton } from '@meldingen/ui'

import type { Component } from './types'

import { Checkbox, Radio, Select, TextArea, TextInput, TimeInput } from './components'
import { isRadio, isSelect, isSelectboxes, isTextarea, isTextfield, isTimefield } from './utils'

const getComponent = (component: Component, hasOneFormComponent: boolean, errorMessage?: string) => {
  const { key } = component
  if (isRadio(component)) {
    return <Radio {...component} errorMessage={errorMessage} hasHeading={hasOneFormComponent} id={key} key={key} />
  }
  if (isSelect(component)) {
    return <Select {...component} errorMessage={errorMessage} hasHeading={hasOneFormComponent} id={key} key={key} />
  }
  if (isSelectboxes(component)) {
    return <Checkbox {...component} errorMessage={errorMessage} hasHeading={hasOneFormComponent} id={key} key={key} />
  }
  if (isTextarea(component)) {
    return <TextArea {...component} errorMessage={errorMessage} hasHeading={hasOneFormComponent} id={key} key={key} />
  }
  if (isTextfield(component)) {
    return <TextInput {...component} errorMessage={errorMessage} hasHeading={hasOneFormComponent} id={key} key={key} />
  }
  if (isTimefield(component)) {
    return <TimeInput {...component} errorMessage={errorMessage} hasHeading={hasOneFormComponent} id={key} key={key} />
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
          const errorMessage = validationErrors?.find((error) => error.key === component.key)?.message
          return getComponent(component, hasOneFormComponent, errorMessage)
        })}
        <SubmitButton>{submitButtonText}</SubmitButton>
      </Form>
    </>
  )
}
