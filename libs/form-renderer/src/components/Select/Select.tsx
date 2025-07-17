import { Field, Label, Select as ADSSelect } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import styles from './Select.module.css'

export type Props = {
  data: {
    values: {
      label: string
      value: string
    }[]
  }
  description?: string
  hasHeading: boolean
  id: string
  label: string
  validate?: { required: boolean } | null
  defaultValue?: string
}

export const Select = ({ description, hasHeading, id, label, validate, data, defaultValue }: Props) => {
  const labelComponent = (
    <Label htmlFor={id} optional={!validate?.required}>
      {label}
    </Label>
  )

  return (
    <Field key={id}>
      {hasHeading ? <h1 className={styles.h1}>{labelComponent}</h1> : labelComponent}
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      <ADSSelect
        key={defaultValue}
        aria-describedby={description ? `${id}-description` : undefined}
        aria-required={validate?.required ? 'true' : undefined}
        id={id}
        name={id}
        defaultValue={defaultValue}
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
