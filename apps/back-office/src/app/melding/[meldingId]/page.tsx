import { getTranslations } from 'next-intl/server'

import { Detail } from './Detail'
import { getAdditionalQuestions, getContactData, getMetadata } from './utils'
import { getMeldingByMeldingId } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params
  const t = await getTranslations('detail')

  return {
    title: t('metadata.title', { meldingId }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  const t = await getTranslations('detail')

  if (error || !data) {
    return t('errors.melding-not-found')
  }

  const additionalQuestions = await getAdditionalQuestions(meldingId)
  if ('error' in additionalQuestions) return additionalQuestions.error

  const additionalQuestionsWithMeldingText = [
    {
      key: 'text',
      term: t('term.text'),
      description: data.text,
    },
    ...additionalQuestions.data,
  ]

  const contact = getContactData(data, t)

  const metadata = getMetadata(data, t)

  return (
    <Detail
      additionalQuestionsWithMeldingText={additionalQuestionsWithMeldingText}
      contact={contact}
      meldingId={data.id}
      metadata={metadata}
    />
  )
}
