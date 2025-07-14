import { Checkbox as ADSCheckbox, Column, FieldSet } from '@amsterdam/design-system-react'

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
  defaultValues?: string[]
}

export const Checkbox = ({ defaultValues, description, id, label, validate, values }: Props) => (
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
          defaultChecked={defaultValues?.includes(value)}
          id={`${id}___${value}`}
          name={`checkbox___${id}___${value}`}
        >
          {checkboxLabel}
        </ADSCheckbox>
      ))}
    </Column>
  </FieldSet>
)
