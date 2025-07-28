import { CharacterCount, ErrorMessage, Field, Label, TextArea as ADSTextArea } from '@amsterdam/design-system-react'
import { useRef, useState } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import { getAriaDescribedBy } from '../../utils'

import styles from './TextArea.module.css'

export type Props = {
  defaultValue?: string
  description?: string
  hasHeading: boolean
  errorMessage?: string
  id: string
  label: string
  maxCharCount?: number | null
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
  validate,
}: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(0)

  const handleChange = () => {
    if (ref.current) {
      setCharCount(ref.current?.value.length)
    }
  }

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
      <ADSTextArea
        aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
        aria-required={validate?.required ? 'true' : undefined}
        id={id}
        invalid={Boolean(errorMessage)}
        name={id}
        onChange={typeof maxCharCount === 'number' ? handleChange : undefined}
        ref={ref}
        rows={4}
        defaultValue={defaultValue}
      />
      {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
    </Field>
  )
}
