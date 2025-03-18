import { Checkbox as ADSCheckbox, Column, FieldSet } from '@amsterdam/design-system-react'

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
}

export const Checkbox = ({ description, id, label, validate, values }: Props) => (
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
    <Column gap="extra-small">
      {values.map(({ label: checkboxLabel, value }) => (
        <ADSCheckbox
          key={value}
          aria-required={validate?.required ? 'true' : undefined}
          name={`checkbox___${id}___${value}`}
          value={value}
        >
          {checkboxLabel}
        </ADSCheckbox>
      ))}
    </Column>
  </FieldSet>
)
