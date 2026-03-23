import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider, testDataProvider } from 'react-admin'

import { AssetTypeEdit } from './AssetTypeEdit'

describe('AssetTypeEdit', () => {
  it('should render all inputs', async () => {
    const dataProvider = testDataProvider({
      getOne: vi.fn().mockResolvedValueOnce({
        data: { arguments: { base_url: 'https://example.com/wfs' }, id: 1, max_assets: 5, name: 'foo' },
      }),
    })

    render(
      <AdminContext dataProvider={dataProvider}>
        <ResourceContextProvider value="asset-type">
          <AssetTypeEdit id={1} />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const nameInput = await screen.findByRole('textbox', { name: 'resources.asset-type.fields.name' })
    const baseUrlInput = await screen.findByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.base_url',
    })
    const maxAssetsInput = await screen.findByRole('spinbutton', { name: 'resources.asset-type.fields.max_assets' })

    expect(nameInput).toBeInTheDocument()
    expect(baseUrlInput).toBeInTheDocument()
    expect(maxAssetsInput).toBeInTheDocument()
    expect(maxAssetsInput).toHaveValue(5)
  })
})
