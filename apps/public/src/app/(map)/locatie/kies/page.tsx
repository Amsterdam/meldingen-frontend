import { getTranslations } from 'next-intl/server'

import { SelectLocation } from './SelectLocation'

export const generateMetadata = async () => {
  const t = await getTranslations('select-location')

  return {
    title: t('metadata.title'),
  }
}

export default async () => <SelectLocation />
