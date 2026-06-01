import { Checkbox, FieldSet } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import type { LabelOutput } from '@meldingen/api-client'

type Props = {
  defaultValues?: number[]
  labels: LabelOutput[]
}

export const LabelsField = ({ defaultValues, labels }: Props) => {
  const t = useTranslations('melding-form')

  return (
    <FieldSet legend={t('labels-label')}>
      {labels.map(({ id, name }) => {
        const isChecked = defaultValues?.includes(id)
        return (
          <Checkbox defaultChecked={isChecked} key={id} name="labels" value={String(id)}>
            {name}
          </Checkbox>
        )
      })}
    </FieldSet>
  )
}
