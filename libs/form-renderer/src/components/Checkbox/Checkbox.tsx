import { Checkbox as ADSCheckbox, Column, FieldSet } from '@amsterdam/design-system-react'
import { ChangeEvent, useState } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

export type Props = {
  description?: string
  id: string
  label: string
  validate?: { required: boolean } | null
  values: {
    label: string
    value: string
  }[]
}

export const Checkbox = ({ description, id, label, validate, values }: Props) => {
  const [checkedValues, setCheckedValues] = useState<string[]>([])

  const handleChange = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    const updated = event.target.checked ? [...checkedValues, value] : checkedValues.filter((v) => v !== value)

    setCheckedValues(updated)
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
