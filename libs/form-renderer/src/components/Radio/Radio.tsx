import { Radio as ADSRadio, Column, ErrorMessage } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FieldSet } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

export type Props = {
  defaultValue?: string
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  validate?: { required: boolean } | null
  values: {
    label: string
    value: string
  }[]
}

export const Radio = ({ defaultValue, description, errorMessage, hasHeading, id, label, validate, values }: Props) => (
  <FieldSet
    aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
    aria-required={validate?.required ? 'true' : undefined}
    hasHeading={hasHeading}
    invalid={Boolean(errorMessage)}
    legend={label}
    optional={!validate?.required}
    role="radiogroup"
  >
    {description && (
      <MarkdownToHtml id={`${id}-description`} type="description">
        {description}
      </MarkdownToHtml>
    )}
    {errorMessage && <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>}
    <Column gap="x-small">
      {values.map(({ label: radioLabel, value }, index) => (
        <ADSRadio
          aria-required={validate?.required ? 'true' : undefined}
          defaultChecked={value === defaultValue}
          id={index === 0 ? id : undefined} // Use component id for first radio, to be able to link to it in the Invalid Form Alert
          invalid={Boolean(errorMessage)}
          key={value}
          name={id}
          value={value}
        >
          {radioLabel}
        </ADSRadio>
      ))}
    </Column>
  </FieldSet>
)
