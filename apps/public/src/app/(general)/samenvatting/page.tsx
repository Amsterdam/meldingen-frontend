import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import {
  getAdditionalQuestionsSummary,
  getContactSummary,
  getLocationSummary,
  getMeldingSummary,
} from './getSummaryData'
import { Summary } from './Summary'

export const generateMetadata = async () => {
  const t = await getTranslations('summary')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value
  const location = cookieStore.get('location')?.value

  const t = await getTranslations()

  if (!meldingId || !token) return { data: {}, error: ['Could not retrieve meldingId or token'] }

  const { data: meldingBodySummary, meldingData } = await getMeldingSummary(meldingId, token)
  const additionalQuestionsAnswers = await getAdditionalQuestionsSummary(meldingId, token)

  const locationSummary = getLocationSummary(t('location.title'), location)
  const contactSummary = getContactSummary(t('summary.contact-label'), meldingData?.email, meldingData?.phone)

  return (
    <Summary
      additionalQuestionsAnswers={additionalQuestionsAnswers}
      contact={contactSummary}
      location={locationSummary}
      melding={meldingBodySummary}
    />
  )
}
