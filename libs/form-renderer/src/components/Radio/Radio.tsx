import { Column, FieldSet, Radio as ADSRadio } from '@amsterdam/design-system-react'

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

export const Radio = ({ description, id, label, validate, values }: Props) => (
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
    <Column gap="extra-small">
      {values.map(({ label: radioLabel, value }) => (
        <ADSRadio key={value} aria-required={validate?.required ? 'true' : undefined} name={id} value={value}>
          {radioLabel}
        </ADSRadio>
      ))}
    </Column>
  </FieldSet>
)
