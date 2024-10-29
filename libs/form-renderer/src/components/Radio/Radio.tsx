import { FieldSet, Paragraph, Radio as ADSRadio, Column } from '@amsterdam/design-system-react'
import type { FormRadioComponentOutput } from '@meldingen/api-client'

type Props = FormRadioComponentOutput & { id: string }

export const Radio = ({ description, id, label, validate, values }: Props) => (
  <FieldSet
    aria-describedby={description ? `${id}-description` : undefined}
    aria-required={validate?.required ? 'true' : undefined}
    legend={label}
    optional={!validate?.required}
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
