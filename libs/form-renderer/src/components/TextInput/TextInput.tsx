import { ErrorMessage, Field, Label } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { TextInput as ADSTextInput } from '@meldingen/ui'

import { Validate } from '../../types'
import { getAriaDescribedBy } from '../../utils'

import styles from './TextInput.module.css'

export type Props = {
  defaultValue?: string
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  validate: Validate
}

export const TextInput = ({
  defaultValue,
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  validate: { required },
}: Props) => {
  const labelComponent = (
    <Label htmlFor={id} optional={!required}>
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
        aria-required={required ? 'true' : undefined}
        defaultValue={defaultValue}
        id={id}
        invalid={Boolean(errorMessage)}
        name={id}
      />
    </Field>
  )
}
