import { ErrorMessage, Field, Label } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { TextInput as ADSTextInput } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

import styles from './TextInput.module.css'

export type Props = {
  defaultValue?: string
  description?: string
  hasHeading: boolean
  errorMessage?: string
  id: string
  label: string
  validate?: { required: boolean } | null
}

export const TextInput = ({ defaultValue, description, errorMessage, hasHeading, id, label, validate }: Props) => {
  const labelComponent = (
    <Label htmlFor={id} optional={!validate?.required}>
      {label}
    </Label>
  )

  return (
    <Field key={id} invalid={Boolean(errorMessage)}>
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
        defaultValue={defaultValue}
        id={id}
        invalid={Boolean(errorMessage)}
        name={id}
      />
    </Field>
  )
}
