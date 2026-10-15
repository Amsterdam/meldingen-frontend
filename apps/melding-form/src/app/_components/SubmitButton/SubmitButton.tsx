import { useTranslations } from 'next-intl'

import type { SubmitButtonProps } from '@meldingen/ui'

import { SubmitButton as UISubmitButton } from '@meldingen/ui'

export const SubmitButton = (props: Omit<SubmitButtonProps, 'loadingLabel'>) => {
  const t = useTranslations('shared')

  return <UISubmitButton {...props} loadingLabel={t('submit-button-loading-label')} />
}
