import { getMeldingData } from './getMeldingData'
import { melding } from '~/mocks/data'

describe('getMeldingData', () => {
  it('returns correct melding summary', () => {
    const result = getMeldingData(melding, (key: string) => key)

    const { classification, created_at, id, labels, source } = melding

    expect(result).toEqual([
      {
        description: new Date(created_at).toLocaleDateString('nl-NL'),
        key: 'created_at',
        term: 'detail.melding-data.created_at',
      },
      {
        description: classification!.name,
        key: 'classification',
        term: 'detail.melding-data.classification.term',
      },
      {
        description: `shared.state.${melding.state}`,
        key: 'state',
        link: {
          href: `/melding/${id}/wijzig-status`,
          label: 'detail.melding-data.state.link',
        },
        term: 'detail.melding-data.state.term',
      },
      {
        description: `shared.urgency.${melding.urgency}`,
        key: 'urgency',
        link: {
          href: `/melding/${id}/wijzig-urgentie`,
          label: 'detail.melding-data.urgency.link',
        },
        term: 'detail.melding-data.urgency.term',
      },
      {
        description: labels?.map((label) => label.name).join(', '),
        key: 'labels',
        link: {
          href: `/melding/${id}/wijzig-labels`,
          label: 'detail.melding-data.labels.link',
        },
        term: 'detail.melding-data.labels.term',
      },
      {
        description: source?.name,
        key: 'source',
        term: 'detail.melding-data.source.term',
      },
    ])
  })

  it('returns fallback label when classification is null', () => {
    const meldingDataWithoutClassification = {
      ...melding,
      classification: null,
    }

    const result = getMeldingData(meldingDataWithoutClassification, (key: string) => key)

    const classificationEntry = result.find((item) => item.key === 'classification')

    expect(classificationEntry?.description).toBe('detail.melding-data.classification.no-data')
  })

  it('returns fallback label when labels is empty', () => {
    const meldingDataWithoutLabels = {
      ...melding,
      labels: [],
    }

    const result = getMeldingData(meldingDataWithoutLabels, (key: string) => key)

    const labelsEntry = result.find((item) => item.key === 'labels')
    expect(labelsEntry?.description).toBe('detail.melding-data.labels.no-data')
  })

  it('returns fallback label when source is null', () => {
    const meldingDataWithoutSource = {
      ...melding,
      source: null,
    }

    const result = getMeldingData(meldingDataWithoutSource, (key: string) => key)

    const sourceEntry = result.find((item) => item.key === 'source')
    expect(sourceEntry?.description).toBe('detail.melding-data.source.no-data')
  })
})
