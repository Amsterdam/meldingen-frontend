import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { Summary } from './Summary'
import {
  getAdditionalQuestionsSummary,
  getContactSummary,
  getLocationSummary,
  getMeldingData,
  getPrimaryFormSummary,
} from './utils'

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
  const locationCookie = cookieStore.get('location')?.value

  const t = await getTranslations()

  if (!meldingId || !token) return 'Could not retrieve meldingId or token'

  const meldingData = await getMeldingData(meldingId, token)
  if (typeof meldingData === 'string') return meldingData

  const additionalQuestions = await getAdditionalQuestionsSummary(meldingId, token)
  if (typeof additionalQuestions === 'string') return additionalQuestions

  const primaryForm = await getPrimaryFormSummary(meldingData.text)
  if (typeof primaryForm === 'string') return primaryForm

  const location = getLocationSummary(t('location.title'), locationCookie)
  const contact = getContactSummary(t('summary.contact-label'), meldingData?.email, meldingData?.phone)

  return (
    <Summary additionalQuestions={additionalQuestions} contact={contact} location={location} melding={primaryForm} />
  )
}
