import { Field, Label, Select as ADSSelect } from '@amsterdam/design-system-react'
import { ChangeEvent, useEffect, useState } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

type Props = {
  data: {
    values: {
      label: string
      value: string
    }[]
  }
  description?: string
  id: string
  label: string
  validate?: { required: boolean } | null
  defaultValue: string
  onChange: (value: string, name: string) => void
}

type AllFormInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export const Select = ({ description, id, label, validate, data, defaultValue, onChange }: Props) => {
  const [selected, setSelected] = useState(defaultValue)

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue)
    }
  }, [defaultValue])

  const handleChange = (event: ChangeEvent<AllFormInputs>) => {
    setSelected(event.target.value)
    onChange(event.target.value, event.target.name)
  }

  return (
    <Field key={id}>
      <Label htmlFor={id} optional={!validate?.required}>
        {label}
      </Label>
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      <ADSSelect
        aria-describedby={description ? `${id}-description` : undefined}
        aria-required={validate?.required ? 'true' : undefined}
        id={id}
        name={id}
        onChange={handleChange}
        value={selected}
      >
        {data.values.map(({ label: optionLabel, value }) => (
          <ADSSelect.Option key={value} value={value}>
            {optionLabel}
          </ADSSelect.Option>
        ))}
      </ADSSelect>
    </Field>
  )
}
