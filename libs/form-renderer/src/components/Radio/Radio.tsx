import { Column, ErrorMessage, Radio as ADSRadio } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FieldSet } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

export type Props = {
  description?: string
  hasHeading: boolean
  errorMessage?: string
  id: string
  label: string
  validate?: { required: boolean } | null
  values: {
    label: string
    value: string
  }[]
  defaultValue?: string
}

export const Radio = ({ description, errorMessage, hasHeading, id, label, validate, values, defaultValue }: Props) => (
  <FieldSet
    aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
    aria-required={validate?.required ? 'true' : undefined}
    invalid={Boolean(errorMessage)}
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
    {errorMessage && <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>}
    <Column gap="x-small">
      {values.map(({ label: radioLabel, value }, index) => (
        <ADSRadio
          key={value}
          aria-required={validate?.required ? 'true' : undefined}
          defaultChecked={value === defaultValue}
          id={index === 0 ? id : undefined} // Use component id for first radio, to be able to link to it in the Invalid Form Alert
          invalid={Boolean(errorMessage)}
          name={id}
          value={value}
        >
          {radioLabel}
        </ADSRadio>
      ))}
    </Column>
  </FieldSet>
)
