import { Field, Label, TextInput as ADSTextInput } from '@amsterdam/design-system-react'
import { ChangeEvent } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

type Props = {
  description?: string
  id: string
  label: string
  validate?: { required: boolean } | null
  defaultValue?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const TextInput = ({ defaultValue, description, id, label, onChange, validate }: Props) => (
  <Field key={id}>
    <Label htmlFor={id} optional={!validate?.required}>
      {label}
    </Label>
    {description && (
      <MarkdownToHtml id={`${id}-description`} type="description">
        {description}
      </MarkdownToHtml>
    )}
    <ADSTextInput
      aria-describedby={description ? `${id}-description` : undefined}
      aria-required={validate?.required ? 'true' : undefined}
      defaultValue={defaultValue}
      id={id}
      name={id}
      onChange={onChange}
    />
  </Field>
)
