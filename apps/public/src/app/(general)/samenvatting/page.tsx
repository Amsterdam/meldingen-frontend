import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import {
  getAdditionalQuestionsSummary,
  getContactSummary,
  getLocationSummary,
  getMeldingData,
  getPrimaryFormSummary,
} from './_utils/getSummaryData'
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

  if (!meldingId || !token) throw new Error('Could not retrieve meldingId or token')

  const meldingData = await getMeldingData(meldingId, token)
  if (typeof meldingData === 'string') return meldingData

  const additionalQuestionsAnswersSummary = await getAdditionalQuestionsSummary(meldingId, token)
  if (typeof additionalQuestionsAnswersSummary === 'string') return additionalQuestionsAnswersSummary

  const primaryFormSummary = await getPrimaryFormSummary(meldingData.text)
  if (typeof primaryFormSummary === 'string') return primaryFormSummary

  const locationSummary = getLocationSummary(t('location.title'), location)
  const contactSummary = getContactSummary(t('summary.contact-label'), meldingData?.email, meldingData?.phone)

  return (
    <Summary
      additionalQuestionsAnswers={additionalQuestionsAnswersSummary}
      contact={contactSummary}
      location={locationSummary}
      melding={primaryFormSummary}
    />
  )
}
