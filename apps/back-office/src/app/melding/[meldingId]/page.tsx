import { getTranslations } from 'next-intl/server'

import { Detail } from './Detail'
import { getAdditionalQuestions, getContactData } from './utils'
import { getMeldingByMeldingId, MeldingOutput } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params
  const t = await getTranslations('detail')

  return {
    title: t('metadata.title', { meldingId }),
  }
}

const formatMeldingData = async (data: MeldingOutput) => {
  const { created_at, classification, state } = data

  const t = await getTranslations('detail.term')

  return [
    {
      key: 'created_at',
      term: t('created_at'),
      description: new Date(created_at).toLocaleDateString('nl-NL'),
    },
    {
      key: 'classification',
      term: t('classification'),
      description: String(classification),
    },
    {
      key: 'state',
      term: t('state'),
      description: state,
    },
  ]
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  const t = await getTranslations('detail')

  if (error || !data) {
    return t('errors.melding-not-found')
  }

  const formattedData = await formatMeldingData(data)

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

  return (
    <Detail
      additionalQuestionsWithMeldingText={additionalQuestionsWithMeldingText}
      contact={contact}
      meldingData={formattedData}
      meldingId={data.id}
      meldingState={data.state}
    />
  )
}
