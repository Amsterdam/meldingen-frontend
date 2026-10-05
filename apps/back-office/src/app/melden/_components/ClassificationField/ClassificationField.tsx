import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

import type { ClassificationOutput } from '@meldingen/api-client'

import type { ClassificationComboboxRef } from '~/app/_components/ClassificationCombobox/ClassificationCombobox'

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

  const comboboxRef = useRef<ClassificationComboboxRef | null>(null)

  useEffect(() => {
    if (!comboboxRef.current) return

    const { classification, setClassification } = comboboxRef.current

    if (classification === '' || classification !== derivedClassification) {
      setClassification(derivedClassification ?? '')
    }

    return () => {}
  }, [derivedClassification, comboboxRef.current?.classification])

  return (
    <ClassificationCombobox
      classifications={classifications}
      defaultValue={derivedClassification}
      errorMessage={errorMessage}
      isDisabled={isDisabled}
      label={t('label')}
      noResultsMessage={t('no-results')}
      ref={comboboxRef}
    />
  )
}
