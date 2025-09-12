import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { Combobox, type Props } from './Combobox'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

const defaultProps: Props = {
  address: '',
  setAddress: vi.fn(),
  setCoordinates: vi.fn(),
  setSelectedAssets: vi.fn(),
}

describe('Combobox', () => {
  it('should render the address input', () => {
    render(<Combobox {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    expect(input).toBeInTheDocument()
  })

  it('should not show the list box initially', () => {
    render(<Combobox {...defaultProps} />)

    const listBox = screen.queryByRole('listbox')

    expect(listBox).not.toBeInTheDocument()
  })

  it('should not show the list box on 2 character input', async () => {
    const user = userEvent.setup()

    render(<Combobox {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'aa')

    await waitFor(() => {
      const listBox = screen.queryByRole('listbox')
      expect(listBox).not.toBeInTheDocument()
    })
  })

  it('should show the list box on 3 or more character input', async () => {
    const user = userEvent.setup()

    render(<Combobox {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'abc')

    await waitFor(() => {
      const listBox = screen.getByRole('listbox')
      expect(listBox).toBeInTheDocument()
    })
  })

  it('should show all options returned by the API', async () => {
    const user = userEvent.setup()

    render(<Combobox {...defaultProps} />)

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

  it('should show a "no results" message when no results are returned', async () => {
    server.use(
      http.get(ENDPOINTS.PDOK_SUGGEST, () =>
        HttpResponse.json({
          response: { numFound: 0, start: 0, maxScore: 0.0, numFoundExact: true, docs: [] },
        }),
      ),
    )

    const user = userEvent.setup()

    render(<Combobox {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    await user.type(input, 'abc')

    await waitFor(() => {
      const noResults = screen.getByRole('option', { name: 'no-results' })
      expect(noResults).toBeInTheDocument()
    })
  })
})
