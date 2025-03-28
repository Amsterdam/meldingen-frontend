import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { getSummaryData } from './_utils/getSummaryData'
import { Summary } from './Summary'
import {
  getMeldingByMeldingIdAnswers,
  getMeldingByMeldingIdMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
} from 'apps/public/src/apiClientProxy'

export const generateMetadata = async () => {
  const t = await getTranslations('summary')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value
  const location = cookieStore.get('location')?.value

  if (!meldingId || !token) return undefined

  const primaryFormId = await getStaticForm().then((response) => response.find((form) => form.type === 'primary')?.id)

  if (!primaryFormId) return undefined

  const primaryForm = (await getStaticFormByStaticFormId({ staticFormId: primaryFormId }))?.components[0]

  const melding = await getMeldingByMeldingIdMelder({ meldingId: parseInt(meldingId, 10), token })

  const additionalQuestionsAnswers = await getMeldingByMeldingIdAnswers({ meldingId: parseInt(meldingId, 10), token })

  const t = await getTranslations()

  const data = getSummaryData({
    melding,
    primaryFormLabel: primaryForm?.label,
    additionalQuestionsAnswers,
    location: location ? JSON.parse(location) : undefined,
    locationLabel: t('location.title'),
    contactLabel: t('summary.contact-label'),
  })

  return <Summary data={data} />
}
