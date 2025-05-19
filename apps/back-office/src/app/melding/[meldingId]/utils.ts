import { getMeldingByMeldingIdAnswers, MeldingOutput } from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

export const getAdditionalQuestions = async (meldingId: number) => {
  const { data, error } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: meldingId },
  })

  if (error) return { error: handleApiError(error) }

  return {
    data:
      data?.map((answer) => ({
        key: `${answer.question.id}`,
        term: answer.question.text,
        description: answer.text,
      })) || [],
  }
}

export const getContactData = (data: MeldingOutput, t: (key: string) => string) => {
  const { email, phone } = data

  if (!email && !phone) return undefined

  return [
    email && {
      key: 'email',
      term: t('term.email'),
      description: email,
    },
    phone && {
      key: 'phone',
      term: t('term.phone'),
      description: phone,
    },
  ].filter((item) => item !== null && item !== undefined && item !== '')
}

export const getMetadata = (data: MeldingOutput, t: (key: string) => string) => {
  const { id, created_at, classification, state } = data

  return [
    {
      key: 'created_at',
      term: t('term.created_at'),
      description: new Date(created_at).toLocaleDateString('nl-NL'),
    },
    {
      key: 'classification',
      term: t('term.classification'),
      description: String(classification),
    },
    {
      key: 'state',
      term: t('term.state'),
      description: state,
      link: {
        href: `/melding/${id}/wijzig-status`,
        label: t('state.link'),
      },
    },
  ]
}
