import { render, screen } from '@testing-library/react'

import type { MeldingServiceLevelObjectiveOutput } from '@meldingen/api-client'

import { formatDateString } from '@meldingen/utils'

import type { OverviewField } from '../constants'

import { OVERVIEW_FIELDS } from '../constants'
import { OverviewFieldValue } from './OverviewFieldValue'
import { URGENCY_VALUES } from '~/constants'
import { melding } from '~/mocks/data'

const getField = (key: OverviewField['key']) => OVERVIEW_FIELDS.find((field) => field.key === key)!

describe('OverviewFieldValue', () => {
  it('renders the address if present', () => {
    const meldingWithAddress = { ...melding, address: 'Amstel 1' }

    const { container } = render(<OverviewFieldValue field={getField('address')} melding={meldingWithAddress} />)

    expect(container).toHaveTextContent('Amstel 1')
  })

  it('renders nothing if address is missing', () => {
    const { container } = render(<OverviewFieldValue field={getField('address')} melding={melding} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the classification name if present', () => {
    const { container } = render(<OverviewFieldValue field={getField('classification')} melding={melding} />)

    expect(container).toHaveTextContent(melding.classification!.name)
  })

  it('renders a fallback label if classification is missing', () => {
    const meldingWithoutClassification = { ...melding, classification: undefined }

    const { container } = render(
      <OverviewFieldValue field={getField('classification')} melding={meldingWithoutClassification} />,
    )

    expect(container).toHaveTextContent('overview.no-classification')
  })

  it('renders a formatted date for created_at', () => {
    const { container } = render(<OverviewFieldValue field={getField('created_at')} melding={melding} />)

    expect(container).toHaveTextContent(formatDateString(melding.created_at).date)
  })

  it('renders days passed and days for days_open', () => {
    const { container } = render(<OverviewFieldValue field={getField('days_open')} melding={melding} />)

    const label = `${melding.service_level_objective!.days_passed}/${melding.service_level_objective!.days}`

    expect(container).toHaveTextContent(label)
    expect(container.querySelector('strong')).not.toBeInTheDocument()
  })

  it('renders days passed and days in a `strong` element when overdue', () => {
    const days = 5
    const days_passed = 7
    const slo: MeldingServiceLevelObjectiveOutput = {
      date_start: '2026-08-10T10:13:05Z',
      day_type: 'working_days',
      days,
      days_passed,
    }

    const meldingWithSLO = { ...melding, service_level_objective: slo }

    const { container } = render(<OverviewFieldValue field={getField('days_open')} melding={meldingWithSLO} />)

    expect(container.querySelector('strong')).toHaveTextContent(`${days_passed}/${days}`)
  })

  it('renders nothing for days_open without a service level objective', () => {
    const meldingWithoutSLO = { ...melding, service_level_objective: null }

    const { container } = render(<OverviewFieldValue field={getField('days_open')} melding={meldingWithoutSLO} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the postal code if present', () => {
    const { container } = render(<OverviewFieldValue field={getField('postal_code')} melding={melding} />)

    expect(container).toHaveTextContent(melding.postal_code!)
  })

  it('renders nothing if postal code is missing', () => {
    const meldingWithoutPostalCode = { ...melding, postal_code: undefined }

    const { container } = render(
      <OverviewFieldValue field={getField('postal_code')} melding={meldingWithoutPostalCode} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a link for public_id', () => {
    render(<OverviewFieldValue field={getField('public_id')} melding={melding} />)

    const link = screen.getByRole('link', { name: melding.public_id })

    expect(link).toHaveAttribute('href', `/melding/${melding.id}`)
  })

  it('renders the translated state key for state', () => {
    const { container } = render(<OverviewFieldValue field={getField('state')} melding={melding} />)

    expect(container).toHaveTextContent(`shared.state.${melding.state}`)
  })

  it.each(URGENCY_VALUES)('renders the translated urgency key for urgency=%s', (urgency) => {
    const { container } = render(<OverviewFieldValue field={getField('urgency')} melding={{ ...melding, urgency }} />)

    expect(container).toHaveTextContent(`shared.urgency.${urgency}`)
  })
})
