import { render, screen } from '@testing-library/react'

import { Bedankt } from './Bedankt'

describe('Bedankt', () => {
  it('should render meldingId and Doe een melding-button', () => {
    render(<Bedankt meldingId="1" />)

    expect(
      screen.getByText('Wij hebben uw melding ontvangen op 21-11-2023 om 17:11. Uw meldnummer is 1.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Doe een melding' })).toBeInTheDocument()
  })
})
