import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { Summary } from './Summary'
import {
  getAdditionalQuestionsSummary,
  getAttachmentsSummary,
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
  // We check for the existence of these cookies in our middleware, so non-null assertion is safe here.
  const meldingId = cookieStore.get('id')!.value
  const token = cookieStore.get('token')!.value
  const locationCookie = cookieStore.get('location')?.value

  const t = await getTranslations()

  const meldingData = await getMeldingData(meldingId, token)
  if ('error' in meldingData) return meldingData.error

  const primaryForm = await getPrimaryFormSummary(meldingData.data.text)
  if ('error' in primaryForm) return primaryForm.error

  const attachments = await getAttachmentsSummary(t('summary.attachments-label'), meldingId, token)
  if ('error' in attachments) return attachments.error

  const additionalQuestions = await getAdditionalQuestionsSummary(meldingId, token)
  if ('error' in additionalQuestions) return additionalQuestions.error

  const location = getLocationSummary(t('summary.location-label'), locationCookie)
  const contact = getContactSummary(t('summary.contact-label'), meldingData.data.email, meldingData.data.phone)

  return (
    <Summary
      attachments={attachments.data}
      additionalQuestions={additionalQuestions.data}
      contact={contact}
      location={location}
      primaryForm={primaryForm.data}
    />
  )
}
