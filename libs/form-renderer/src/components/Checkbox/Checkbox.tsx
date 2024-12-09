import { FieldSet, Paragraph, Checkbox as ADSCheckbox, Column } from '@amsterdam/design-system-react'

type Props = {
  description?: string
  id: string
  label: string
  validate?: { required: boolean } | null
  values: {
    label: string
    value: string
  }[]
}

export const Checkbox = ({ description, id, label, validate, values }: Props) => (
  <FieldSet
    aria-labelledby={`${id}-fieldset ${id}-description`}
    id={`${id}-fieldset`}
    legend={label}
    optional={!validate?.required}
  >
    {description && (
      <Paragraph className="ams-mb--sm" id={`${id}-description`} size="small">
        {description}
      </Paragraph>
    )}
    <Column gap="extra-small">
      {values.map(({ label: checkboxLabel, value }) => (
        <ADSCheckbox
          key={value}
          aria-required={validate?.required ? 'true' : undefined}
          name={`checkbox___${id}___${value}`}
          value={value}
        >
          {checkboxLabel}
        </ADSCheckbox>
      ))}
    </Column>
  </FieldSet>
)
