import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { Summary } from './Summary'
import {
  getAdditionalQuestionsSummary,
  getAttachmentsSummary,
  getContactSummary,
  getLocationSummary,
  getPrimaryFormSummary,
} from './utils'
import { getMeldingData } from '../_utils/getMeldingData'
import { COOKIES } from 'apps/melding-form/src/constants'

export const generateMetadata = async () => {
  const t = await getTranslations('summary')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const t = await getTranslations('summary')

  const meldingData = await getMeldingData(meldingId, token)
  const { classification, email, phone, text } = meldingData

  const primaryForm = await getPrimaryFormSummary(text)
  const attachments = await getAttachmentsSummary(t('attachments-label'), meldingId, token)
  const additionalQuestions = await getAdditionalQuestionsSummary(meldingId, token, classification?.id)
  const location = getLocationSummary(t, meldingData)
  const contact = getContactSummary(t('contact-label'), email, phone)

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
