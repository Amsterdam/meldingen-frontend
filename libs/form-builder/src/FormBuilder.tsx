import type { Component as ComponentSchema } from '@formio/core'
import type { FormBuilder as FormBuilderProps } from '@formio/js'

import { Components, FormBuilder as FormioFormBuilder, Templates } from '@formio/js'
import { useEffect, useRef } from 'react'

import { Radio, Select, SelectBoxes, Textarea, Textfield, Time } from './components'
import { time } from './templates'

import '@formio/js/dist/formio.builder.min.css'
import './visually-hidden.css' // This class is set by Form.io, but not included in the builder CSS, so we add it ourselves
import nl from './translations/nl.json'

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

type Props = {
  data?: ComponentSchema[]
  onChange: (schema: { components: unknown[] }) => void
}

export const FormBuilder = ({ data, onChange }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const builderInstance = useRef<FormioFormBuilder | null>(null)

  Components.setComponents({
    radio: Radio,
    select: Select,
    selectboxes: SelectBoxes,
    textarea: Textarea,
    textfield: Textfield,
    time: Time,
  })

  Templates.current = {
    ...Templates.current,
    time: time,
  }

  useEffect(() => {
    if (!ref.current) return

    builderInstance.current = new FormioFormBuilder(ref.current, { components: data ?? [], display: 'wizard' }, options)

    const handleChange = () => {
      onChange(builderInstance.current?.instance.form)
    }

    const builderEvents = [
      { action: handleChange, name: 'addComponent' },
      { action: handleChange, name: 'saveComponent' },
      { action: handleChange, name: 'updateComponent' },
      { action: handleChange, name: 'removeComponent' },
      { action: handleChange, name: 'deleteComponent' },
    ]

    builderInstance.current.ready.then(() => {
      builderEvents.forEach(({ action, name }) => {
        builderInstance.current?.instance.on(name, action)
      })
    })

    return () => {
      if (builderInstance.current) {
        builderInstance.current.instance.destroy(true)
      }
    }
  }, [data])

  return <div ref={ref} />
}
