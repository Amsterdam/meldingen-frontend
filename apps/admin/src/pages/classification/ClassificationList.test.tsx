import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminContext, memoryStore, ResourceContextProvider, testDataProvider } from 'react-admin'

import { ClassificationList } from './ClassificationList'

describe('ClassificationList', () => {
  it('renders', () => {
    render(
      <AdminContext>
        <ResourceContextProvider value="classification">
          <ClassificationList />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const exportButton = screen.getByRole('button', { name: 'ra.action.export' })

    expect(exportButton).toBeInTheDocument()
  })

  it('filters classifications by the search input and removes the filter when cleared', async () => {
    const user = userEvent.setup()
    const getList = vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Afval' }], total: 1 })
    const dataProvider = testDataProvider({ getList })

    render(
      <AdminContext dataProvider={dataProvider} store={memoryStore()}>
        <ResourceContextProvider value="classification">
          <ClassificationList />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const searchInput = await screen.findByRole('textbox')

    await user.type(searchInput, 'Afval')

    await waitFor(() => {
      expect(getList).toHaveBeenLastCalledWith('classification', expect.objectContaining({ filter: { q: 'Afval' } }))
    })

    await user.clear(searchInput)

    await waitFor(() => {
      expect(getList).toHaveBeenLastCalledWith('classification', expect.objectContaining({ filter: {} }))
    })
  })
})
