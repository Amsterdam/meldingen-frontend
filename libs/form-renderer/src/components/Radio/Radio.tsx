import { Radio as ADSRadio, Column, ErrorMessage } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FieldSet } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

export type Props = {
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  onChange: (value: string) => void
  validate?: { required: boolean } | null
  value: string
  values: {
    label: string
    value: string
  }[]
}

export const Radio = ({
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  onChange,
  validate,
  value,
  values,
}: Props) => (
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
      {values.map(({ label: radioLabel, value: radioValue }, index) => (
        <ADSRadio
          aria-required={validate?.required ? 'true' : undefined}
          checked={radioValue === value}
          id={index === 0 ? id : undefined} // Use component id for first radio, to be able to link to it in the Invalid Form Alert
          invalid={Boolean(errorMessage)}
          key={radioValue}
          name={id}
          onChange={() => onChange(radioValue)}
          value={radioValue}
        >
          {radioLabel}
        </ADSRadio>
      ))}
    </Column>
  </FieldSet>
)
