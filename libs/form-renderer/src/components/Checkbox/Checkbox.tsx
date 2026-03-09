import { Checkbox as ADSCheckbox, Column, ErrorMessage } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FieldSet } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

export type Props = {
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  onChange: (value: string[]) => void
  validate?: { required: boolean } | null
  value: string[]
  values: {
    label: string
    value: string
  }[]
}

export const Checkbox = ({
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  onChange,
  validate,
  value,
  values,
}: Props) => {
  const ariaDescribedBy = getAriaDescribedBy(id, description, errorMessage)

  return (
    <FieldSet
      // Because of an NVDA bug, we need to add the description and error to the label (https://github.com/nvaccess/nvda/issues/12718)
      // For more information, see https://designsystem.amsterdam/?path=/docs/components-forms-field-set--docs#checkbox-group
      aria-labelledby={`${id}-fieldset${ariaDescribedBy ? ` ${ariaDescribedBy}` : ''}`}
      hasHeading={hasHeading}
      id={`${id}-fieldset`}
      invalid={Boolean(errorMessage)}
      legend={label}
      optional={!validate?.required}
    >
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      {errorMessage && <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>}
      <Column gap="x-small">
        {values.map(({ label: checkboxLabel, value: checkboxValue }, index) => (
          <ADSCheckbox
            aria-required={validate?.required ? 'true' : undefined}
            checked={value.includes(checkboxValue)}
            id={index === 0 ? id : undefined} // Use component id for first checkbox, to be able to link to it in the Invalid Form Alert
            invalid={Boolean(errorMessage)}
            key={checkboxValue}
            name={`checkbox___${id}___${checkboxValue}`}
            onChange={(e) => {
              const newValue = e.target.checked ? [...value, checkboxValue] : value.filter((v) => v !== checkboxValue)
              onChange(newValue)
            }}
            value={checkboxValue}
          >
            {checkboxLabel}
          </ADSCheckbox>
        ))}
      </Column>
    </FieldSet>
  )
}
