import { CharacterCount, Field, Label, TextArea as ADSTextArea } from '@amsterdam/design-system-react'
import { ChangeEvent, useRef, useState } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

type Props = {
  defaultValue?: string
  description?: string
  id: string
  label: string
  maxCharCount?: number | null
  onChange: (value: string, name: string) => void
  validate?: { required: boolean } | null
}

export const TextArea = ({ description, id, label, maxCharCount, validate, onChange, defaultValue }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(0)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (typeof maxCharCount === 'number' && ref.current) {
      setCharCount(ref.current?.value.length)
    }
    onChange(event.target.value, event.target.name)
  }

  return (
    <Field key={id}>
      <Label htmlFor={id} optional={!validate?.required}>
        {label}
      </Label>
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      <ADSTextArea
        aria-describedby={description ? `${id}-description` : undefined}
        aria-required={validate?.required ? 'true' : undefined}
        id={id}
        name={id}
        onChange={handleChange}
        ref={ref}
        rows={4}
        defaultValue={defaultValue}
      />
      {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
    </Field>
  )
}
