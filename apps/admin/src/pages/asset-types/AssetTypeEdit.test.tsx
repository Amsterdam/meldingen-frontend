import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider, testDataProvider } from 'react-admin'

import { AssetTypeEdit } from './AssetTypeEdit'

describe('AssetTypeEdit', () => {
  it('renders', async () => {
    const dataProvider = testDataProvider({
      getOne: vi.fn().mockResolvedValueOnce({
        data: { name: 'foo' },
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

    expect(nameInput).toHaveValue('foo')
  })
})
