import { render, screen } from '@testing-library/react'

import { Thanks } from './Thanks'

describe('Thanks', () => {
  it('should render meldingId and Doe een melding-link', () => {
    render(<Thanks meldingId="1" />)

    const paragraph = screen.getByText('Wij hebben uw melding ontvangen op 21-11-2023 om 17:11. Uw meldnummer is 1.')
    const link = screen.getByRole('link', { name: 'Doe een melding' })

    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })
})
