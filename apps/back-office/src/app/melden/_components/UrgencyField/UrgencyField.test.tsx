import { render, screen } from '@testing-library/react'

import { UrgencyField } from './UrgencyField'
import { URGENCY_VALUES } from '~/constants'

describe('UrgencyField', () => {
  it('renders all urgency radio options', () => {
    render(<UrgencyField defaultValue={0} />)

    expect(screen.getByRole('radiogroup', { name: 'urgency-label' })).toBeInTheDocument()

    URGENCY_VALUES.forEach((urgency) => {
      expect(screen.getByRole('radio', { name: `urgency.${urgency}` })).toBeInTheDocument()
    })
  })
})
