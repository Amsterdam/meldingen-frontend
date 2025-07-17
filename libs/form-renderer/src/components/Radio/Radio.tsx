import { Column, Radio as ADSRadio } from '@amsterdam/design-system-react'

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
  defaultValue?: string
}

export const Radio = ({ description, hasHeading, id, label, validate, values, defaultValue }: Props) => (
  <FieldSet
    aria-describedby={description ? `${id}-description` : undefined}
    aria-required={validate?.required ? 'true' : undefined}
    legend={label}
    optional={!validate?.required}
    hasHeading={hasHeading}
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
          defaultChecked={value === defaultValue}
        >
          {radioLabel}
        </ADSRadio>
      ))}
    </Column>
  </FieldSet>
)
