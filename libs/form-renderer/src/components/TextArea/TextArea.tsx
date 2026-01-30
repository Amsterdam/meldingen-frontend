import { TextArea as ADSTextArea, CharacterCount, ErrorMessage, Field, Label } from '@amsterdam/design-system-react'
import { useRef, useState } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import { Validate } from '../../types'
import { getAriaDescribedBy } from '../../utils'

import styles from './TextArea.module.css'

export type Props = {
  defaultValue?: string
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  validate: Validate
}

export const TextArea = ({
  defaultValue,
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  validate: { maxLength, required },
}: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(defaultValue?.length || 0)

  const handleChange = () => {
    if (ref.current) {
      setCharCount(ref.current?.value.length)
    }
  }

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
      <ADSTextArea
        aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
        aria-required={required ? 'true' : undefined}
        defaultValue={defaultValue}
        id={id}
        invalid={Boolean(errorMessage)}
        name={id}
        onChange={handleChange}
        ref={ref}
        rows={4}
      />
      {maxLength && <CharacterCount length={charCount} maxLength={maxLength} />}
    </Field>
  )
}
