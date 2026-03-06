import { FormDateComponentOutputWithValues, FormOutputWithoutPanelComponents } from '../page'
import { setDateComponentOptions } from './setDateComponentOptions'

describe('setDateComponentOptions', () => {
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

  it('returns "Vandaag" with correct converted_date for the first entry', () => {
    const components = [{ dayRange: 1, key: 'incidentDate', type: 'date' }] as FormDateComponentOutputWithValues[]

    const result = setDateComponentOptions(components)
    const values = (result[0] as FormDateComponentOutputWithValues).values

    expect(values[0]).toEqual({
      converted_date: '2026-03-03',
      label: 'Vandaag',
      value: 'day',
    })
  })

  it('returns "Gisteren" with correct date for the second entry', () => {
    const components = [{ dayRange: 2, key: 'incidentDate', type: 'date' }] as FormOutputWithoutPanelComponents[]

    const result = setDateComponentOptions(components)
    const values = (result[0] as FormDateComponentOutputWithValues).values

    expect(values[1]).toEqual({
      converted_date: '2026-03-02',
      label: 'Gisteren 2 maart',
      value: 'day - 1',
    })
  })

  it('returns full day name and date from the third entry onwards', () => {
    const components = [{ dayRange: 3, key: 'incidentDate', type: 'date' }] as FormDateComponentOutputWithValues[]

    const result = setDateComponentOptions(components)
    const values = (result[0] as FormDateComponentOutputWithValues).values

    expect(values[2]).toEqual({
      converted_date: '2026-03-01',
      label: 'Zondag 1 maart',
      value: 'day - 2',
    })
  })

  it('return "Weet ik niet" as the last entry', () => {
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
      { key: 'name', label: 'Name', type: 'text' },
      { dayRange: 2, key: 'incidentDate', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ] as FormDateComponentOutputWithValues[]

    const result = setDateComponentOptions(components)

    expect(result[0]).toEqual(components[0])
    expect((result[1] as FormDateComponentOutputWithValues).values).toHaveLength(3)
    expect(result[2]).toEqual(components[2])
  })
})
