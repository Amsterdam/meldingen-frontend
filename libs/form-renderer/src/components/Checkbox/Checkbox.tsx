'use client'

import { Checkbox as ADSCheckbox, Column, FieldSet } from '@amsterdam/design-system-react'
import { ChangeEvent, useEffect, useState } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

type Props = {
  description?: string
  id: string
  label: string
  validate?: { required: boolean } | null
  values: {
    label: string
    value: string
  }[]
  onChange: (value: string[], name: string) => void
  defaultValue: string[]
}

export const Checkbox = ({ description, id, label, validate, values, onChange, defaultValue }: Props) => {
  const [checkedValues, setCheckedValues] = useState<string[]>([])

  useEffect(() => {
    if (defaultValue) setCheckedValues(defaultValue)
  }, [defaultValue])

  const handleChange = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    const updated = event.target.checked ? [...checkedValues, value] : checkedValues.filter((v) => v !== value)

    setCheckedValues(updated)
    onChange(updated, id)
  }

  return (
    <FieldSet
      aria-labelledby={`${id}-fieldset ${id}-description`}
      id={`${id}-fieldset`}
      legend={label}
      optional={!validate?.required}
    >
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      <Column gap="x-small">
        {values.map(({ label: checkboxLabel, value }) => (
          <ADSCheckbox
            key={value}
            aria-required={validate?.required ? 'true' : undefined}
            name={`checkbox___${id}___${value}`}
            id={`${id}___${value}`}
            value={value}
            checked={checkedValues.includes(value)}
            onChange={(e) => handleChange(e, value)}
          >
            {checkboxLabel}
          </ADSCheckbox>
        ))}
      </Column>
    </FieldSet>
  )
}
