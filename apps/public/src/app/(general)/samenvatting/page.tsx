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
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value
  const locationCookie = cookieStore.get('location')?.value

  const t = await getTranslations()

  if (!meldingId || !token) return 'Could not retrieve meldingId or token'

  const meldingData = await getMeldingData(meldingId, token)
  if ('error' in meldingData) return meldingData.error

  const primaryForm = await getPrimaryFormSummary(meldingData.data.text)
  if ('error' in primaryForm) return primaryForm.error

  const additionalQuestions = await getAdditionalQuestionsSummary(meldingId, token)
  if ('error' in additionalQuestions) return additionalQuestions.error

  const attachments = await getAttachmentsSummary(t('attachments.step.title'), meldingId, token)
  if ('error' in attachments) return attachments.error

  const location = getLocationSummary(t('location.title'), locationCookie)
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
