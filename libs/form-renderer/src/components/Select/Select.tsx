import { Field, Label, Select as ADSSelect } from '@amsterdam/design-system-react'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'

type Props = {
  data: {
    values: {
      label: string
      value: string
    }[]
  }
  description?: string
  id: string
  label: string
  validate?: { required: boolean } | null
}

export const Select = ({ description, id, label, validate, data }: Props) => (
  <Field key={id}>
    <Label htmlFor={id} optional={!validate?.required}>
      {label}
    </Label>
    {description && (
      <MarkdownToHtml id={`${id}-description`} type="description">
        {description}
      </MarkdownToHtml>
    )}
    <ADSSelect
      aria-describedby={description ? `${id}-description` : undefined}
      aria-required={validate?.required ? 'true' : undefined}
      id={id}
      name={id}
    >
      {data.values.map(({ label: optionLabel, value }) => (
        <ADSSelect.Option key={value} value={value}>
          {optionLabel}
        </ADSSelect.Option>
      ))}
    </ADSSelect>
  </Field>
)
