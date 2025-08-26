import type { Component as ComponentSchema } from '@formio/core'
import { Components, FormBuilder as FormioFormBuilder } from '@formio/js'
import type { FormBuilder as FormBuilderProps } from '@formio/js'
import { useEffect, useRef } from 'react'

import { Radio, Select, SelectBoxes, Textarea, Textfield } from './components'
import nl from './translations/nl.json'
import '@formio/js/dist/formio.full.min.css'

type ExtendedFormBuilderOptions = FormBuilderProps['options'] & {
  i18n?: {
    [key: string]: object
  }
}

const options: ExtendedFormBuilderOptions = {
  language: 'nl',
  i18n: { nl },
  noDefaultSubmitButton: true,
  builder: {
    basic: {
      default: true,
      components: {
        button: false,
        checkbox: false,
        number: false,
        password: false,
      },
    },
    advanced: false,
    layout: false,
    data: false,
    premium: false,
  },
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
  })

  useEffect(() => {
    if (!ref.current) return

    builderInstance.current = new FormioFormBuilder(ref.current, { display: 'wizard', components: data ?? [] }, options)

    const handleChange = () => {
      onChange(builderInstance.current?.instance.form)
    }

    const builderEvents = [
      { name: 'addComponent', action: handleChange },
      { name: 'saveComponent', action: handleChange },
      { name: 'updateComponent', action: handleChange },
      { name: 'removeComponent', action: handleChange },
      { name: 'deleteComponent', action: handleChange },
    ]

    builderInstance.current.ready.then(() => {
      builderEvents.forEach(({ name, action }) => {
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
