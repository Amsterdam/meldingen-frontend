import { Select as ADSSelect, ErrorMessage, Field, Label } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import { getAriaDescribedBy } from '../../utils'

import styles from './Select.module.css'

export type Props = {
  data: {
    values: {
      label: string
      value: string
    }[]
  }
  defaultValue?: string
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  validate?: { required: boolean } | null
}

export const Select = ({ data, defaultValue, description, errorMessage, hasHeading, id, label, validate }: Props) => {
  const labelComponent = (
    <Label htmlFor={id} optional={!validate?.required}>
      {label}
    </Label>
  )

  return (
    <Field invalid={Boolean(errorMessage)} key={id}>
      {hasHeading ? <h1 className={styles.h1}>{labelComponent}</h1> : labelComponent}
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      {errorMessage && <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>}
      <ADSSelect
        aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
        aria-required={validate?.required ? 'true' : undefined}
        defaultValue={defaultValue}
        id={id}
        invalid={Boolean(errorMessage)}
        key={defaultValue}
        name={id}
      >
        {data.values.map(({ label: optionLabel, value }) => (
          <ADSSelect.Option key={value} value={value}>
            {optionLabel}
          </ADSSelect.Option>
        ))}
      </ADSSelect>
    </Field>
  )
}
