import type { MeldingOutput } from '@meldingen/api-client'

export const getMeldingData = (data: MeldingOutput, t: (key: string) => string) => {
  const { classification, created_at, id, labels, source, state, urgency } = data

  return [
    {
      description: new Date(created_at).toLocaleDateString('nl-NL'),
      key: 'created_at',
      term: t('detail.melding-data.created_at'),
    },
    {
      description: classification ? classification.name : t('detail.melding-data.classification.no-data'),
      key: 'classification',
      term: t('detail.melding-data.classification.term'),
    },
    {
      description: t(`shared.state.${state}`),
      key: 'state',
      link: {
        href: `/melding/${id}/wijzig-status`,
        label: t('detail.melding-data.state.link'),
      },
      term: t('detail.melding-data.state.term'),
    },
    {
      description: t(`shared.urgency.${urgency}`),
      key: 'urgency',
      link: {
        href: `/melding/${id}/wijzig-urgentie`,
        label: t('detail.melding-data.urgency.link'),
      },
      term: t('detail.melding-data.urgency.term'),
    },
    {
      description: labels?.length
        ? labels.map((label) => label.name).join(', ')
        : t('detail.melding-data.labels.no-data'),
      key: 'labels',
      link: {
        href: `/melding/${id}/wijzig-labels`,
        label: t('detail.melding-data.labels.link'),
      },
      term: t('detail.melding-data.labels.term'),
    },
    {
      description: source ? source.name : t('detail.melding-data.source.no-data'),
      key: 'source',
      term: t('detail.melding-data.source.term'),
    },
  ]
}
