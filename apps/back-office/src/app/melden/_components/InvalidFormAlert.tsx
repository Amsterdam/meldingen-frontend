import { useTranslations } from 'next-intl'
import type { RefObject } from 'react'

import { InvalidFormAlert as UIInvalidFormAlert } from '@meldingen/ui'

type Props = {
  ref: RefObject<HTMLDivElement | null>
  validationErrors: { key: string; message: string }[]
}

export const InvalidFormAlert = ({ ref, validationErrors }: Props) => {
  const t = useTranslations('melding-form.errors')

  return (
    <UIInvalidFormAlert
      className="ams-mb-m"
      errors={validationErrors.map((error) => ({
        id: `#${error.key}`,
        label: error.message,
      }))}
      heading={t('invalid-form-alert-title')}
      headingLevel={2}
      ref={ref}
    />
  )
}
