import type { Component as ComponentSchema } from '@formio/core'
import type { FormBuilder as FormBuilderProps } from '@formio/js'

import { Components, FormBuilder as FormioFormBuilder } from '@formio/js'
import { useEffect, useRef } from 'react'

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

type Props = {
  data?: ComponentSchema[]
  onChange: (schema: { components: ComponentSchema[] }) => void
}

const serializeComponents = (components?: ComponentSchema[]) => JSON.stringify(components ?? [])

const createFormSchema = (components?: ComponentSchema[]) => ({
  components: components ?? [],
  display: 'wizard' as const,
})

export const FormBuilder = ({ data, onChange }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const builderInstance = useRef<FormioFormBuilder | null>(null)
  const onChangeRef = useRef(onChange)
  const lastSyncedComponents = useRef(serializeComponents(data))

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

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!ref.current || builderInstance.current) return

    builderInstance.current = new FormioFormBuilder(ref.current, createFormSchema(data), options)

    const handleChange = () => {
      const schema = builderInstance.current?.instance.form as { components: ComponentSchema[] } | undefined

      lastSyncedComponents.current = serializeComponents(schema?.components)
      onChangeRef.current(schema ?? { components: [] })
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
        builderInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    const nextComponents = serializeComponents(data)

    if (!builderInstance.current || nextComponents === lastSyncedComponents.current) {
      return
    }

    lastSyncedComponents.current = nextComponents
    builderInstance.current.ready?.then(() => {
      builderInstance.current?.setForm(createFormSchema(data))
    })
  }, [data])

  return <div ref={ref} />
}
