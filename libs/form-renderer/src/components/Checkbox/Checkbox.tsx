import { Checkbox as ADSCheckbox, Column, ErrorMessage } from '@amsterdam/design-system-react'

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
  defaultValues?: string[]
}

export const Checkbox = ({
  defaultValues,
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  validate,
  values,
}: Props) => {
  const ariaDescribedBy = getAriaDescribedBy(id, description, errorMessage)

  return (
    <FieldSet
      // The description and the error ids are added to the FieldSet's label, because of an NVDA bug.
      // See https://designsystem.amsterdam/?path=/docs/components-forms-field-set--docs#checkbox-group
      aria-labelledby={`${id}-fieldset${ariaDescribedBy ? ` ${ariaDescribedBy}` : ''}`}
      id={`${id}-fieldset`}
      invalid={Boolean(errorMessage)}
      legend={label}
      optional={!validate?.required}
      hasHeading={hasHeading}
    >
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      {errorMessage && <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>}
      <Column gap="x-small">
        {values.map(({ label: checkboxLabel, value }) => (
          <ADSCheckbox
            key={value}
            aria-required={validate?.required ? 'true' : undefined}
            defaultChecked={defaultValues?.includes(value)}
            invalid={Boolean(errorMessage)}
            name={`checkbox___${id}___${value}`}
            value={value}
          >
            {checkboxLabel}
          </ADSCheckbox>
        ))}
      </Column>
    </FieldSet>
  )
}
