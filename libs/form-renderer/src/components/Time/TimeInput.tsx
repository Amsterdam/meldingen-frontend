import { TimeInput as ADSTimeInput, ErrorMessage, Field, Label } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import { getAriaDescribedBy } from '../../utils'

import styles from './TimeInput.module.css'

export type Props = {
  defaultValue?: string
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  validate?: { required: boolean } | null
}

export const TimeInput = ({ defaultValue, description, errorMessage, hasHeading, id, label, validate }: Props) => {
  console.log('--- ~ defaultValue:', defaultValue)
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
      <ADSTimeInput
        aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
        aria-required={validate?.required ? 'true' : undefined}
        defaultValue={defaultValue}
        id={id}
        invalid={Boolean(errorMessage)}
        name={id}
      />
    </Field>
  )
}
