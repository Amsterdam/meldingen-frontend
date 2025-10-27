import { render, screen } from '@testing-library/react'
import { AdminContext, DataProvider, ResourceContextProvider, testDataProvider } from 'react-admin'

import { AssetTypeEdit } from './AssetTypeEdit'

describe('AssetTypeEdit', () => {
  it('should render all inputs', async () => {
    const dataProvider = testDataProvider({
      getOne: vi.fn().mockResolvedValueOnce({ data: { id: 1, name: 'foo' } }),
    })

    render(
      <AdminContext dataProvider={dataProvider as unknown as DataProvider}>
        <ResourceContextProvider value="asset-type">
          <AssetTypeEdit id={1} />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const nameInput = await screen.findByRole('textbox', { name: 'resources.asset-type.fields.name' })
    const baseUrlInput = await screen.findByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.base_url',
    })

    expect(nameInput).toBeInTheDocument()
    expect(baseUrlInput).toBeInTheDocument()
  })
})
