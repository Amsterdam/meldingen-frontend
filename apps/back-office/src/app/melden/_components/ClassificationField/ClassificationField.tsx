import { useTranslations } from 'next-intl'

import type { ClassificationOutput } from '@meldingen/api-client'

import { ClassificationCombobox } from '~/app/_components'

type Props = {
  classifications: ClassificationOutput[]
  derivedClassification?: string
  errorMessage?: string
  isDisabled?: boolean
}

export const ClassificationField = ({
  classifications,
  derivedClassification,
  errorMessage,
  isDisabled = false,
}: Props) => {
  const t = useTranslations('melding-form.classification')

  return (
    <ClassificationCombobox
      classifications={classifications}
      defaultValue={derivedClassification}
      errorMessage={errorMessage}
      isDisabled={isDisabled}
      // Remount when the derived classification changes, so the combobox resets to the new value
      key={derivedClassification}
      label={t('label')}
      noResultsMessage={t('no-results')}
    />
  )
}
