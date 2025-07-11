import { Field, Label, TextInput as ADSTextInput } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

export type Props = {
  description?: string
  id: string
  label: string
  validate?: { required: boolean } | null
  defaultValue?: string
}

export const TextInput = ({ defaultValue, description, id, label, validate }: Props) => (
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
    />
  </Field>
)
