import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import type { Props } from './AddressInput'

import { AddressInput } from './AddressInput'
import { PDOKReverse } from '~/mocks/data'
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
  onAddressSelect: vi.fn(),
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
  })

  it('empties the address while the address of new coordinates is fetched', async () => {
    const { container, rerender } = render(<AddressInput {...defaultProps} coordinates={coordinates} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })

    server.use(http.get(ENDPOINTS.PDOK_REVERSE, () => new Promise(() => {})))

    rerender(<AddressInput {...defaultProps} coordinates={{ lat: 52.37, lng: 4.9 }} />)

    const coordinatesInput = container.querySelector('input[name="coordinates"]')

    expect(screen.getByRole('combobox', { name: 'label' })).toHaveValue('')
    expect(coordinatesInput).toHaveValue('')
  })

  it('saves the coordinates of a selected address option', async () => {
    const user = userEvent.setup()
    const onAddressSelect = vi.fn()

    const { container, rerender } = render(<AddressInput onAddressSelect={onAddressSelect} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'abc')
    await user.click(await screen.findByRole('option', { name: 'Amsteldijk 152A-H, 1079LG Amsterdam' }))

    const selectedCoordinates = onAddressSelect.mock.calls[0][0]

    rerender(<AddressInput coordinates={selectedCoordinates} onAddressSelect={onAddressSelect} />)

    const coordinatesInput = container.querySelector('input[name="coordinates"]')

    expect(screen.getByRole('combobox', { name: 'label' })).toHaveValue('Amsteldijk 152A-H, 1079LG Amsterdam')
    expect(coordinatesInput).toHaveValue(JSON.stringify(selectedCoordinates))
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

  it('does not show the address of a request that resolves after the coordinates are cleared', async () => {
    let resolveRequest = () => {}
    const requestCanResolve = new Promise<void>((resolve) => {
      resolveRequest = resolve
    })

    server.use(
      http.get(ENDPOINTS.PDOK_REVERSE, async () => {
        await requestCanResolve

        return HttpResponse.json(PDOKReverse)
      }),
    )

    const { rerender } = render(<AddressInput {...defaultProps} coordinates={coordinates} />)

    rerender(<AddressInput {...defaultProps} />)

    resolveRequest()

    // Give a late response the chance to update the input
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(screen.getByRole('combobox', { name: 'label' })).toHaveValue('')
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

  it('does not show the options of a request that resolves after the input has changed', async () => {
    let resolveFirstRequest = () => {}
    const firstRequestCanResolve = new Promise<void>((resolve) => {
      resolveFirstRequest = resolve
    })

    const createResponse = (weergavenaam: string) =>
      HttpResponse.json({ response: { docs: [{ centroide_ll: 'POINT(4.9 52.37)', id: weergavenaam, weergavenaam }] } })

    server.use(
      http.get(ENDPOINTS.PDOK_SUGGEST, async ({ request }) => {
        if (new URL(request.url).searchParams.get('q') === 'abc') {
          await firstRequestCanResolve

          return createResponse('Stale address')
        }

        return createResponse('New address')
      }),
    )

    const user = userEvent.setup()

    render(<AddressInput {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    // Wait for the debounce, so the first request is sent before typing again
    await user.type(input, 'abc')
    await new Promise((resolve) => setTimeout(resolve, 300))
    await user.type(input, 'd')

    // Resolve the first request while the second one is still debounced
    resolveFirstRequest()
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(screen.queryByRole('option', { name: 'Stale address' })).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'New address' })).toBeInTheDocument()
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
