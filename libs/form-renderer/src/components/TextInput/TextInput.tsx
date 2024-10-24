import { Field, Label, Paragraph, TextInput as ADSTextInput } from '@amsterdam/design-system-react'

type Props = {
  description?: string
  id: string
  label: string
  validate?: {
    required: boolean
  } | null
}

export const TextInput = ({ description, id, label, validate }: Props) => (
  <Field key={id}>
    <Label htmlFor={id}>{label}</Label>
    {description && (
      <Paragraph size="small" id={`${id}-description`}>
        {description}
      </Paragraph>
    )}
    <ADSTextInput
      aria-describedby={description ? `${id}-description` : undefined}
      aria-required={validate?.required ? 'true' : undefined}
      id={id}
    />
  </Field>
)
