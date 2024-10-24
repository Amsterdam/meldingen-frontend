import { FieldSet, Paragraph, Checkbox as ADSCheckbox, Column } from '@amsterdam/design-system-react'
import type { FormCheckboxComponentOutput } from '@meldingen/api-client'

type Props = FormCheckboxComponentOutput & { id: string }

export const Checkbox = ({ description, id, label, validate, values }: Props) => (
  <FieldSet id={`${id}-fieldset`} aria-labelledby={`${id}-fieldset ${id}-description`} legend={label}>
    {description && (
      <Paragraph className="ams-mb--sm" id={`${id}-description`} size="small">
        {description}
      </Paragraph>
    )}
    <Column gap="extra-small">
      {values.map(({ label: checkboxLabel, value }) => (
        <ADSCheckbox key={value} aria-required={validate?.required ? 'true' : undefined} name={id} value={value}>
          {checkboxLabel}
        </ADSCheckbox>
      ))}
    </Column>
  </FieldSet>
)
