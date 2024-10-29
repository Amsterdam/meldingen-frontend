import { Field, Label, Select as ADSSelect, Paragraph } from '@amsterdam/design-system-react'
import type { FormSelectComponentOutput } from '@meldingen/api-client'

type Props = FormSelectComponentOutput & { id: string }

export const Select = ({ description, id, label, validate, data }: Props) => (
  <Field key={id}>
    <Label htmlFor={id} optional={!validate?.required}>
      {label}
    </Label>
    {description && (
      <Paragraph size="small" id={`${id}-description`}>
        {description}
      </Paragraph>
    )}
    <ADSSelect
      aria-describedby={description ? `${id}-description` : undefined}
      aria-required={validate?.required ? 'true' : undefined}
      id={id}
    >
      {data.values.map(({ label: optionLabel, value }) => (
        <ADSSelect.Option key={value} value={value}>
          {optionLabel}
        </ADSSelect.Option>
      ))}
    </ADSSelect>
  </Field>
)
