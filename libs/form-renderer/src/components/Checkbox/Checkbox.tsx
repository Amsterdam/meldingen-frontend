import { Checkbox as ADSCheckbox, Column, ErrorMessage } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FieldSet } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

export type Props = {
  defaultValues?: string[]
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
        {values.map(({ label: checkboxLabel, value }, index) => (
          <ADSCheckbox
            aria-required={validate?.required ? 'true' : undefined}
            defaultChecked={defaultValues?.includes(value)}
            id={index === 0 ? id : undefined} // Use component id for first checkbox, to be able to link to it in the Invalid Form Alert
            invalid={Boolean(errorMessage)}
            key={value}
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
