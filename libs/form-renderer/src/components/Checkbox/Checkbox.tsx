import { Checkbox as ADSCheckbox, Column } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FieldSet } from '@meldingen/ui'

export type Props = {
  description?: string
  hasHeading: boolean
  id: string
  label: string
  validate?: { required: boolean } | null
  values: {
    label: string
    value: string
  }[]
  defaultValues?: string[]
}

export const Checkbox = ({ defaultValues, description, hasHeading, id, label, validate, values }: Props) => (
  <FieldSet
    aria-labelledby={`${id}-fieldset ${id}-description`}
    id={`${id}-fieldset`}
    legend={label}
    optional={!validate?.required}
    hasHeading={hasHeading}
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
          name={`checkbox___${id}___${value}`}
          value={value}
        >
          {checkboxLabel}
        </ADSCheckbox>
      ))}
    </Column>
  </FieldSet>
)
