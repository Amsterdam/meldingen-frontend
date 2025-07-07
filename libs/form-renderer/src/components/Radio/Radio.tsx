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
  onChange: (value: string, name: string) => void
  defaultValue?: string
}

export const Radio = ({ description, id, label, validate, values, onChange, defaultValue }: Props) => {
  const [checkedValue, setCheckedValue] = useState<string>('')

  useEffect(() => {
    if (defaultValue) setCheckedValue(defaultValue)
  }, [defaultValue])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckedValue(event.target.value)
    onChange(event.target.value, id)
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
            checked={value === checkedValue}
            onChange={handleChange}
          >
            {radioLabel}
          </ADSRadio>
        ))}
      </Column>
    </FieldSet>
  )
}
