import { render, screen } from '@testing-library/react'

import type { MeldingServiceLevelObjectiveOutput } from '@meldingen/api-client'

import { renderOverviewFieldValue } from './renderOverviewFieldValue'
import { melding } from '~/mocks/data'

const t = (key: string) => key

describe('renderOverviewFieldValue', () => {
  it('renders a link for the public id field', () => {
    const result = renderOverviewFieldValue(melding, { key: 'public_id', labelKey: 'column-header.public_id' }, t)

    render(<>{result}</>)

    const link = screen.getByRole('link', { name: melding.public_id })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `/melding/${melding.id}`)
  })

  it('returns a formatted value for the days_open field', () => {
    const result = renderOverviewFieldValue(melding, { key: 'days_open', labelKey: 'column-header.days_open' }, t)

    expect(result).toBe(`${melding.service_level_objective!.days_passed}/${melding.service_level_objective!.days}`)
  })

  it('returns a formatted value in a `strong` element when overdue', () => {
    const days = 5
    const days_passed = 7
    const slo: MeldingServiceLevelObjectiveOutput = {
      date_start: '2026-08-10T10:13:05Z',
      day_type: 'working_days',
      days,
      days_passed,
    }

    const meldingWithSLO = { ...melding, service_level_objective: slo }

    const result = renderOverviewFieldValue(
      meldingWithSLO,
      { key: 'days_open', labelKey: 'column-header.days_open' },
      t,
    )

    const label = `${days_passed}/${days}`

    expect(result).toEqual(<strong>{label}</strong>)
  })

  it('returns a formatted value for non-public_id fields', () => {
    const result = renderOverviewFieldValue(melding, { key: 'state', labelKey: 'column-header.state' }, t)

    expect(result).toBe(`shared.state.${melding.state}`)
  })
})
