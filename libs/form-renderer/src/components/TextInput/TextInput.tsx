import { ErrorMessage, Field, Label } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { TextInput as ADSTextInput } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

import styles from './TextInput.module.css'

export type Props = {
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  onChange: (value: string) => void
  validate?: { required: boolean } | null
  value: string
}

export const TextInput = ({ description, errorMessage, hasHeading, id, label, onChange, validate, value }: Props) => {
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
      <ADSTextInput
        aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
        aria-required={validate?.required ? 'true' : undefined}
        id={id}
        invalid={Boolean(errorMessage)}
        name={id}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </Field>
  )
}
