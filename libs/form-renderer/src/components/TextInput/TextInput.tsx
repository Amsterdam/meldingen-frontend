import { Field, Label, TextInput as ADSTextInput } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import styles from './TextInput.module.css'

export type Props = {
  defaultValue?: string
  description?: string
  hasHeading: boolean
  id: string
  label: string
  validate?: { required: boolean } | null
}

export const TextInput = ({ defaultValue, description, hasHeading, id, label, validate }: Props) => {
  const labelComponent = (
    <Label htmlFor={id} optional={!validate?.required}>
      {label}
    </Label>
  )
  return (
    <Field key={id}>
      {hasHeading ? <h1 className={styles.h1}>{labelComponent}</h1> : labelComponent}
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
}
