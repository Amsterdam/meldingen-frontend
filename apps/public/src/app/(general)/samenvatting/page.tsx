import { getTranslations } from 'next-intl/server'

import { getSummaryData } from './getSummaryData'
import { Summary } from './Summary'
import type { Props as SummaryProps } from './Summary'

export const generateMetadata = async () => {
  const t = await getTranslations('summary')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const { data, error } = await getSummaryData()

  if (error.length > 0) {
    return error.forEach((error) => {
      throw new Error(error)
    })
  }

  return <Summary {...(data as SummaryProps)} />
}
