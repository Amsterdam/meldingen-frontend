import { FormBuilder as FormioFormBuilder } from '@formio/js'
import type { FormBuilderProps, FormType } from '@formio/react'
import type { ComponentSchema } from 'formiojs'
import { useEffect, useRef } from 'react'

import nl from './translations/nl.json'
import 'formiojs/dist/formio.builder.min.css'

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
  onChange: (schema: FormType) => void
}

// https://github.com/ronaldtech051/React-First-Project/blob/main/src/components/FormBuilder.jsx

export const FormBuilder = ({ data, onChange }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const builderInstance = useRef<FormioFormBuilder | null>(null)

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
