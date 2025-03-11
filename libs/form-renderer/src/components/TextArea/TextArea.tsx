import { CharacterCount, Field, Label, TextArea as ADSTextArea } from '@amsterdam/design-system-react'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { useRef, useState } from 'react'

type Props = {
  description?: string
  id: string
  label: string
  maxCharCount?: number | null
  validate?: { required: boolean } | null
}

export const TextArea = ({ description, id, label, maxCharCount, validate }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(0)

  const handleChange = () => {
    if (ref.current) {
      setCharCount(ref.current?.value.length)
    }
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
        onChange={typeof maxCharCount === 'number' ? handleChange : undefined}
        ref={ref}
        rows={4}
      />
      {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
    </Field>
  )
}
