import { TextArea as ADSTextArea, CharacterCount, ErrorMessage, Field, Label } from '@amsterdam/design-system-react'
import { ChangeEvent, useRef, useState } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import { getAriaDescribedBy } from '../../utils'

import styles from './TextArea.module.css'

export type Props = {
  defaultValue?: string
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  maxCharCount?: number | null
  onChange: (value: string) => void
  validate?: { required: boolean } | null
}

export const TextArea = ({
  defaultValue,
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  maxCharCount,
  onChange,
  validate,
}: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(defaultValue?.length || 0)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (typeof maxCharCount === 'number' && ref.current) {
      setCharCount(ref.current.value.length)
    }
    onChange(event.target.value)
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
        defaultValue={defaultValue}
        id={id}
        invalid={Boolean(errorMessage)}
        name={id}
        onChange={handleChange}
        ref={ref}
        rows={4}
      />
      {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
    </Field>
  )
}
