import type { DaysType, MeldingOutput } from '@meldingen/api-client'

import { formatDateString } from '@meldingen/utils'

import { isReclassificationAllowed } from './isReclassificationAllowed'

const objectiveDayTypeLabels: Record<DaysType, string> = {
  calendar_days: 'dagen',
  working_days: 'werkdagen',
}

export const getMeldingData = (data: MeldingOutput, t: (key: string) => string) => {
  const { classification, created_at, id, labels, service_level_objective, source, state, urgency } = data

  const createdAt = formatDateString(created_at)

  return [
    {
      description: `${createdAt.date} ${createdAt.time}`,
      key: 'created_at',
      term: t('detail.melding-data.created_at'),
    },
    {
      description: service_level_objective
        ? `${service_level_objective.days} ${objectiveDayTypeLabels[service_level_objective.day_type]}`
        : t('detail.melding-data.service-level-objective-days.no-data'),
      key: 'service_level_objective',
      term: t('detail.melding-data.service-level-objective-days.term'),
    },
    {
      description: classification ? classification.name : t('detail.melding-data.classification.no-data'),
      key: 'classification',
      ...(isReclassificationAllowed(state)
        ? {
            link: {
              href: `/melding/${id}/wijzig-categorie`,
              label: t('detail.melding-data.classification.link'),
            },
          }
        : {}),
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
