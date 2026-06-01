import { Column, FieldSet, Radio } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { URGENCY_VALUES } from '~/constants'

type Props = {
  defaultValue: number
}

export const UrgencyField = ({ defaultValue }: Props) => {
  const t = useTranslations('melding-form')
  const tShared = useTranslations('shared')

  return (
    <FieldSet aria-required="true" legend={t('urgency-label')} role="radiogroup">
      <Column gap="x-small">
        {URGENCY_VALUES.map((urgency) => (
          <Radio
            aria-required="true"
            defaultChecked={urgency === defaultValue}
            key={urgency}
            name="urgency"
            value={String(urgency)}
          >
            {tShared(`urgency.${urgency}`)}
          </Radio>
        ))}
      </Column>
    </FieldSet>
  )
}
