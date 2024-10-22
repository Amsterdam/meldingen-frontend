import { CharacterCount, Field, Label, Paragraph, TextArea as ADSTextArea } from '@amsterdam/design-system-react'
import { useRef, useState } from 'react'

type TextAreaProps = {
  description?: string
  id: string
  label: string
  maxCharCount?: number | null
  validate?: {
    required: boolean
  } | null
}

export const TextArea = ({ description, id, label, maxCharCount, validate }: TextAreaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(0)

  const handleChange = () => {
    if (ref.current) {
      setCharCount(ref.current?.value.length)
    }
  }

  return (
    <Field key={id}>
      <Label htmlFor={id}>{label}</Label>
      {description && (
        <Paragraph size="small" id={`${id}-description`}>
          {description}
        </Paragraph>
      )}
      <ADSTextArea
        aria-describedby={description ? `${id}-description` : undefined}
        aria-required={validate?.required ? 'true' : undefined}
        id={id}
        onChange={typeof maxCharCount === 'number' ? handleChange : undefined}
        ref={ref}
        rows={4}
      />
      {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
    </Field>
  )
}
