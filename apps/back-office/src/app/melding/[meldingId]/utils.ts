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

  const items = []

  if (email) {
    items.push({
      key: 'email',
      term: t('term.email'),
      description: email,
    })
  }

  if (phone) {
    items.push({
      key: 'phone',
      term: t('term.phone'),
      description: phone,
    })
  }

  return items
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
