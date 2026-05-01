import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider, testDataProvider } from 'react-admin'

import { AssetTypeEdit } from './AssetTypeEdit'

describe('AssetTypeEdit', () => {
  it('should render all inputs', async () => {
    const dataProvider = testDataProvider({
      getOne: vi.fn().mockResolvedValueOnce({
        data: {
          arguments: {
            filter: 'my-filter',
            icon_entry: 'my-icon',
            icon_folder: 'my-folder',
            srs_name: 'EPSG:4326',
            type_names: 'bar',
          },
          id: 1,
          max_assets: 5,
          name: 'foo',
        },
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
    const iconEntryInput = await screen.findByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.icon_entry',
    })
    const iconFolderInput = await screen.findByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.icon_folder',
    })
    const typeNamesInput = await screen.findByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.type_names',
    })
    const srsNameInput = await screen.findByRole('textbox', { name: 'resources.asset-type.fields.arguments.srs_name' })
    const filterInput = await screen.findByRole('textbox', { name: 'resources.asset-type.fields.arguments.filter' })
    const baseUrlInput = await screen.findByRole('textbox', { name: 'resources.asset-type.fields.arguments.base_url' })
    const maxAssetsInput = await screen.findByRole('spinbutton', { name: 'resources.asset-type.fields.max_assets' })

    expect(nameInput).toBeInTheDocument()
    expect(iconEntryInput).toBeInTheDocument()
    expect(iconEntryInput).toHaveValue('my-icon')
    expect(iconFolderInput).toBeInTheDocument()
    expect(iconFolderInput).toHaveValue('my-folder')
    expect(typeNamesInput).toBeInTheDocument()
    expect(typeNamesInput).toHaveValue('bar')
    expect(srsNameInput).toBeInTheDocument()
    expect(srsNameInput).toHaveValue('EPSG:4326')
    expect(filterInput).toBeInTheDocument()
    expect(filterInput).toHaveValue('my-filter')
    expect(baseUrlInput).toBeInTheDocument()
    expect(maxAssetsInput).toBeInTheDocument()
    expect(maxAssetsInput).toHaveValue(5)
  })
})
