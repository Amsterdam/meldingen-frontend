import type { ChangeEvent } from 'react'

import { TextArea as ADSTextArea, CharacterCount, ErrorMessage, Field, Label } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import { getAriaDescribedBy } from '../../utils'

import styles from './TextArea.module.css'

export type Props = {
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  maxCharCount?: number | null
  onChange: (value: string) => void
  validate?: { required: boolean } | null
  value: string
}

export const TextArea = ({
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  maxCharCount,
  onChange,
  validate,
  value,
}: Props) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

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
      <ADSTextArea
        aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
        aria-required={validate?.required ? 'true' : undefined}
        id={id}
        invalid={Boolean(errorMessage)}
        name={id}
        onChange={handleChange}
        rows={4}
        value={value}
      />
      {maxCharCount && <CharacterCount length={value.length} maxLength={maxCharCount} />}
    </Field>
  )
}
