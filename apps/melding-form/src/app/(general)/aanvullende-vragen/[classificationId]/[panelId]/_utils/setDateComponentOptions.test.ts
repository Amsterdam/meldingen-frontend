import type { FormDateComponentOutputWithValues, FormOutputWithoutPanelComponents } from '../page'

import { setDateComponentOptions } from './setDateComponentOptions'

const MOCK_DATE = new Date('2026-03-03T12:00:00.000Z')

describe('setDateComponentOptions', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: MOCK_DATE })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('leaves non-date components unchanged', () => {
    const components = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ] as FormDateComponentOutputWithValues[]

    const result = setDateComponentOptions(components)

    expect(result).toEqual(components)
  })

  it('injects date options into date components', () => {
    const components = [{ dayRange: 1, key: 'incidentDate', type: 'date' }] as FormDateComponentOutputWithValues[]

    const result = setDateComponentOptions(components)

    expect(result[0]).toMatchObject({
      key: 'incidentDate',
      type: 'date',
      values: expect.any(Array),
    })
  })

  it('returns the correct label, converted_date and value for a 5 day range', () => {
    const components = [{ dayRange: 5, key: 'incidentDate', type: 'date' }] as FormDateComponentOutputWithValues[]

    const result = setDateComponentOptions(components)
    const values = (result[0] as FormDateComponentOutputWithValues).values

    expect(values.slice(0, 5)).toEqual([
      { converted_date: '2026-03-03', label: 'Vandaag', value: 'day' },
      { converted_date: '2026-03-02', label: 'Gisteren 2 maart', value: 'day - 1' },
      { converted_date: '2026-03-01', label: 'Zondag 1 maart', value: 'day - 2' },
      { converted_date: '2026-02-28', label: 'Zaterdag 28 februari', value: 'day - 3' },
      { converted_date: '2026-02-27', label: 'Vrijdag 27 februari', value: 'day - 4' },
    ])
  })

  it('returns "Weet ik niet" as the last entry', () => {
    const components = [{ dayRange: 3, key: 'incidentDate', type: 'date' }] as FormDateComponentOutputWithValues[]

    const result = setDateComponentOptions(components)
    const values = (result[0] as FormDateComponentOutputWithValues).values

    expect(values[values.length - 1]).toEqual({
      converted_date: null,
      label: 'Weet ik niet',
      value: 'Unknown',
    })
  })

  it('returns an array of length dayRange + 1 (for "Weet ik niet")', () => {
    const dayRange = 5
    const components = [{ dayRange, key: 'incidentDate', type: 'date' }] as FormDateComponentOutputWithValues[]

    const result = setDateComponentOptions(components)
    const values = (result[0] as FormDateComponentOutputWithValues).values

    expect(values).toHaveLength(dayRange + 1)
  })

  it('handles mixed component types correctly', () => {
    const components = [
      { key: 'name', label: 'Name', type: 'text' } as FormOutputWithoutPanelComponents,
      { dayRange: 2, key: 'incidentDate', type: 'date' } as FormDateComponentOutputWithValues,
      { key: 'description', label: 'Description', type: 'textarea' } as FormOutputWithoutPanelComponents,
    ]

    const result = setDateComponentOptions(components)

    expect(result[0]).toEqual(components[0])
    expect((result[1] as FormDateComponentOutputWithValues).values).toHaveLength(3)
    expect(result[2]).toEqual(components[2])
  })
})
