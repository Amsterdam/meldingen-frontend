import type { Component as ComponentSchema } from '@formio/core'
import type { FormBuilder as FormBuilderProps } from '@formio/js'

import { Components, FormBuilder as FormioFormBuilder } from '@formio/js'
import { useEffect, useEffectEvent, useRef } from 'react'

import { Date, Panel, Radio, Select, SelectBoxes, Textarea, Textfield, Time } from './components'
import nl from './translations/nl.json'

import '@formio/js/dist/formio.builder.min.css'
import './visually-hidden.css' // This class is set by Form.io, but not included in the builder CSS, so we add it ourselves

type ExtendedFormBuilderOptions = FormBuilderProps['options'] & {
  i18n?: {
    [key: string]: object
  }
}

const options: ExtendedFormBuilderOptions = {
  builder: {
    advanced: false,
    basic: {
      components: {
        button: false,
        checkbox: false,
        number: false,
        password: false,
      },
      default: true,
    },
    data: false,
    layout: false,
    premium: false,
  },
  i18n: { nl },
  language: 'nl',
  noDefaultSubmitButton: true,
}

const getFormSchema = (components: ComponentSchema[] = []) => ({
  components,
  display: 'wizard' as const,
})

Components.setComponents({
  date: Date,
  panel: Panel,
  radio: Radio,
  select: Select,
  selectboxes: SelectBoxes,
  textarea: Textarea,
  textfield: Textfield,
  time: Time,
})

type Props = {
  components?: ComponentSchema[]
  onChange: (schema: { components: ComponentSchema[] }) => void
}

export const FormBuilder = ({ components, onChange }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const builderInstance = useRef<FormioFormBuilder | null>(null)
  const handleChange = useEffectEvent(() => {
    if (!builderInstance.current) {
      return
    }

    onChange(builderInstance.current.instance.form)
  })

  useEffect(() => {
    if (!ref.current) return

    const builder = new FormioFormBuilder(ref.current, getFormSchema(), options)
    builderInstance.current = builder

    const builderEvents = [
      { action: handleChange, name: 'addComponent' },
      { action: handleChange, name: 'saveComponent' },
      { action: handleChange, name: 'updateComponent' },
      { action: handleChange, name: 'removeComponent' },
      { action: handleChange, name: 'deleteComponent' },
    ]

    let isDisposed = false

    void builder.ready.then(() => {
      if (isDisposed) {
        return
      }

      builderEvents.forEach(({ action, name }) => {
        builder.instance.on(name, action)
      })
    })

    return () => {
      isDisposed = true

      if (builderInstance.current) {
        builderInstance.current.instance.destroy(true)
        builderInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    const nextForm = getFormSchema(components ?? [])

    if (builderInstance.current && JSON.stringify(builderInstance.current.form) !== JSON.stringify(nextForm)) {
      void builderInstance.current.setForm(nextForm)
    }
  }, [components])

  return <div ref={ref} />
}
