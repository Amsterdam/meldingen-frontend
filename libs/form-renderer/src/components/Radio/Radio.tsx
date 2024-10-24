import { FieldSet, Paragraph, Radio as ADSRadio, Column } from '@amsterdam/design-system-react'

type Props = {
  description?: string
  id: string
  label: string
  validate?: {
    required: boolean
  } | null
  values: {
    label: string
    value: string
  }[]
}

export const Radio = ({ description, id, label, validate, values }: Props) => (
  <FieldSet
    aria-describedby={description ? `${id}-description` : undefined}
    aria-required={validate?.required ? 'true' : undefined}
    legend={label}
    role="radiogroup"
  >
    {description && (
      <Paragraph className="ams-mb--sm" id={`${id}-description`} size="small">
        {description}
      </Paragraph>
    )}
    <Column gap="extra-small">
      {values.map(({ label: radioLabel, value }) => (
        <ADSRadio key={value} aria-required={validate?.required ? 'true' : undefined} name={id} value={value}>
          {radioLabel}
        </ADSRadio>
      ))}
    </Column>
  </FieldSet>
)
