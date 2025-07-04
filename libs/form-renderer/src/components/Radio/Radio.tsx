import { Column, FieldSet, Radio as ADSRadio } from '@amsterdam/design-system-react'
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
  onChange: (values: {
    target: {
      value: string[]
      name: string
    }
  }) => void
  defaultValue: string[]
}

export const Radio = ({ description, id, label, validate, values, onChange, defaultValue }: Props) => {
  const [checkedValues, setCheckedValues] = useState<string[]>([])

  useEffect(() => {
    if (defaultValue) setCheckedValues(defaultValue)
  }, [defaultValue])

  const handleChange = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    const updated = event.target.checked ? [value] : checkedValues.filter((v) => v !== value)

    setCheckedValues(updated)
    onChange({
      target: {
        value: updated,
        name: id,
      },
    })
  }

  return (
    <FieldSet
      aria-describedby={description ? `${id}-description` : undefined}
      aria-required={validate?.required ? 'true' : undefined}
      legend={label}
      optional={!validate?.required}
      role="radiogroup"
    >
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      <Column gap="x-small">
        {values.map(({ label: radioLabel, value }) => (
          <ADSRadio
            key={value}
            aria-required={validate?.required ? 'true' : undefined}
            name={id}
            value={value}
            checked={checkedValues.includes(value)}
            onChange={(e) => handleChange(e, value)}
          >
            {radioLabel}
          </ADSRadio>
        ))}
      </Column>
    </FieldSet>
  )
}
