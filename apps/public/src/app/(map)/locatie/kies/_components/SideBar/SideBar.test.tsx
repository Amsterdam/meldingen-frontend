import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { SideBar } from './SideBar'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('SideBar', () => {
  it('should render correctly', () => {
    render(<SideBar />)

    const heading = screen.getByRole('heading', { name: 'Selecteer de locatie' })
    const paragraph = screen.getAllByRole('paragraph')

    expect(heading).toBeInTheDocument()
    expect(paragraph[0]).toBeInTheDocument()
  })

  it('should show an address based on provided coordinates ', async () => {
    render(<SideBar coordinates={{ lat: 52.37239126063553, lon: 4.900905743712159 }} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })
  })
})
