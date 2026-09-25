import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import type { Props } from './AddressInput'

import { AddressInput } from './AddressInput'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.stubGlobal(
  'ResizeObserver',
  class {
    disconnect = vi.fn()
    observe = vi.fn()
    unobserve = vi.fn()
  },
)

const defaultProps: Props = {
  setCoordinates: vi.fn(),
  setSelectedAssets: vi.fn(),
}

const coordinates = { lat: 52.37239126063553, lng: 4.900905743712159 }

describe('AddressInput', () => {
  it('renders the address input', () => {
    render(<AddressInput {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    expect(input).toBeInTheDocument()
  })

  it('does not show the list box initially', () => {
    render(<AddressInput {...defaultProps} />)

    const listBox = screen.queryByRole('listbox')

    expect(listBox).not.toBeInTheDocument()
  })

  it('does not show the list box on 2 character input', async () => {
    const user = userEvent.setup()

    render(<AddressInput {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'aa')

    await waitFor(() => {
      const listBox = screen.queryByRole('listbox')

      expect(listBox).not.toBeInTheDocument()
    })
  })

  it('shows the list box on 3 or more character input', async () => {
    const user = userEvent.setup()

    render(<AddressInput {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'abc')

    await waitFor(() => {
      const listBox = screen.getByRole('listbox')

      expect(listBox).toBeInTheDocument()
    })
  })

  it('shows an address and saves coordinates when coordinates are provided', async () => {
    const { container } = render(<AddressInput {...defaultProps} coordinates={coordinates} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })

    const coordinatesInput = container.querySelector('input[name="coordinates"]')

    expect(coordinatesInput).toHaveValue(JSON.stringify(coordinates))
  })

  it('does not save the coordinates when the address is edited', async () => {
    const user = userEvent.setup()

    const { container } = render(<AddressInput {...defaultProps} coordinates={coordinates} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'abc')

    const coordinatesInput = container.querySelector('input[name="coordinates"]')

    expect(coordinatesInput).toHaveValue('')
    expect(defaultProps.setCoordinates).not.toHaveBeenCalled()
  })

  it('clears the address when the coordinates are cleared', async () => {
    const { rerender } = render(<AddressInput {...defaultProps} coordinates={coordinates} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })

    rerender(<AddressInput {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    expect(input).toHaveValue('')
  })

  it('shows all options returned by the API', async () => {
    const user = userEvent.setup()

    render(<AddressInput {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'abc')

    await waitFor(() => {
      const listItems = screen.getAllByRole('option')

      expect(listItems).toHaveLength(5)
      expect(listItems[0]).toHaveTextContent('Amsteldijk 152A-H, 1079LG Amsterdam')
      expect(listItems[1]).toHaveTextContent('Amstelkade 166A-H, 1078AX Amsterdam')
      expect(listItems[2]).toHaveTextContent('Amstelkade 169A-H, 1078AZ Amsterdam')
      expect(listItems[3]).toHaveTextContent('Amstelveenseweg 170B-H, 1075XP Amsterdam')
      expect(listItems[4]).toHaveTextContent('Amstel 312A-H, 1017AP Amsterdam')
    })
  })

  it('shows a "no results" message when no results are returned', async () => {
    server.use(
      http.get(ENDPOINTS.PDOK_SUGGEST, () =>
        HttpResponse.json({
          response: { docs: [], maxScore: 0.0, numFound: 0, numFoundExact: true, start: 0 },
        }),
      ),
    )

    const user = userEvent.setup()

    render(<AddressInput {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'abc')

    await waitFor(() => {
      const noResults = screen.getByRole('option', { name: 'no-results' })

      expect(noResults).toBeInTheDocument()
    })
  })

  it('shows a generic label if no address is found within 30 meters of the coordinates', async () => {
    server.use(
      http.get(ENDPOINTS.PDOK_REVERSE, () =>
        HttpResponse.json({
          response: {
            docs: [],
            numFound: 0,
          },
        }),
      ),
    )

    render(<AddressInput {...defaultProps} coordinates={coordinates} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('no-address')).toBeInTheDocument()
    })
  })

  it('shows an error when an error message is provided', () => {
    render(<AddressInput {...defaultProps} errorMessage="This is an error message" />)

    const errorMessage = screen.getByText('This is an error message')

    expect(errorMessage).toBeInTheDocument()
  })
})
