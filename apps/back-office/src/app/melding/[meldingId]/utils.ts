import { getFullNLAddress } from '../../utils'
import { getMeldingByMeldingIdAnswers, MeldingOutput } from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

export const getAdditionalQuestionsData = async (meldingId: number) => {
  const { data, error } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: meldingId },
  })

  if (error) return { error: handleApiError(error) }

  return {
    data:
      data?.map((answer) => ({
        key: String(answer.question.id),
        term: answer.question.text,
        description: answer.text,
      })) || [],
  }
}

export const getContactData = (data: MeldingOutput, t: (key: string) => string) => {
  const { email, phone } = data

  return [
    {
      key: 'email',
      term: t('contact.email'),
      description: email ?? t('contact.no-data'),
    },
    {
      key: 'phone',
      term: t('contact.phone'),
      description: phone ?? t('contact.no-data'),
    },
  ]
}

export const getMeldingData = (data: MeldingOutput, t: (key: string) => string) => {
  const { id, created_at, classification, state } = data

  return [
    {
      key: 'created_at',
      term: t('melding-data.created_at'),
      description: new Date(created_at).toLocaleDateString('nl-NL'),
    },
    {
      key: 'classification',
      term: t('melding-data.classification'),
      description: classification ? classification.name : t('no-classification'),
    },
    {
      key: 'state',
      term: t('melding-data.state.term'),
      description: state,
      link: {
        href: `/melding/${id}/wijzig-status`,
        label: t('melding-data.state.link'),
      },
    },
  ]
}

export const getLocationData = (data: MeldingOutput, t: (key: string) => string) => {
  const address = getFullNLAddress(data)

  if (!address) return undefined

  return [
    {
      key: 'address',
      term: t('location.address'),
      description: address,
    },
  ]
}
