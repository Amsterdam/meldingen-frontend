import { CharacterCount, Field, Label, Paragraph, TextArea as ADSTextArea } from '@amsterdam/design-system-react'
import type { FormTextAreaComponentOutput } from '@meldingen/api-client'
import { useRef, useState } from 'react'

type Props = FormTextAreaComponentOutput & { id: string }

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
