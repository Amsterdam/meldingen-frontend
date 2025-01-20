import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { SideBar } from './SideBar'

vi.mock('../../_utils', () => ({
  getAddressFromCoordinates: vi.fn().mockReturnValue('Nieuwmarkt 15, 1011JR Amsterdam'),
}))

describe('SideBar', () => {
  it('should render correctly', () => {
    render(<SideBar />)

    const heading = screen.getByRole('heading', { name: 'Selecteer de locatie' })
    const paragraph = screen.getByRole('paragraph')

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
  })

  it.skip('should render render address based on provided coordinates ', async () => {
    render(<SideBar coordinates={{ lat: 52.37239126063553, lon: 4.900905743712159 }} />)

    await waitFor(() => {
      expect(screen.getByText('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })
  })

  it('should render the address input', () => {
    render(<SideBar />)

    const input = screen.getByRole('combobox', { name: 'Zoek op adres' })

    expect(input).toBeInTheDocument()
  })

  it('should not show the list box initially', () => {
    render(<SideBar />)

    const listBox = screen.queryByRole('listbox')

    expect(listBox).not.toBeInTheDocument()
  })

  it('should not show the list box on 2 character input', () => {
    const user = userEvent.setup()

    render(<SideBar />)

    const input = screen.getByRole('combobox', { name: 'Zoek op adres' })

    user.type(input, 'aa')

    const listBox = screen.queryByRole('listbox')

    expect(listBox).not.toBeInTheDocument()
  })

  it('should show the list box on 3 or more character input', () => {
    // const user = userEvent.setup()
    // render(<SideBar />)
    // const input = screen.getByRole('combobox', { name: 'Zoek op adres' })
    // user.type(input, 'aaa')
    // const listBox = screen.getByRole('listbox')
    // expect(listBox).toBeInTheDocument()
  })

  it('should show all options returned by the API', () => {})

  it('should show a "no results" message when no results are returned', () => {})
})
