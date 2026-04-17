import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider, testDataProvider } from 'react-admin'

import { i18nProvider } from '../../app/providers/i18nProvider'
import { AssetTypeEdit } from './AssetTypeEdit'

describe('AssetTypeEdit', () => {
  it('should render all inputs', async () => {
    const dataProvider = testDataProvider({
      getOne: vi.fn().mockResolvedValueOnce({
        data: {
          arguments: { filter: 'my-filter', icon_entry: 'my-icon', srs_name: 'EPSG:4326', type_names: 'bar' },
          id: 1,
          max_assets: 5,
          name: 'foo',
        },
      }),
    })

    render(
      <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <ResourceContextProvider value="asset-type">
          <AssetTypeEdit id={1} />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const nameInput = await screen.findByRole('textbox', { name: /Naam/i })
    const iconEntryInput = await screen.findByRole('textbox', { name: /Icon koppelcode/i })
    const typeNamesInput = await screen.findByRole('textbox', { name: /Typenames/i })
    const srsNameInput = await screen.findByRole('textbox', { name: /SRS name/i })
    const filterInput = await screen.findByRole('textbox', { name: /Filter/i })
    const baseUrlInput = await screen.findByRole('textbox', { name: /WFS url/i })
    const maxAssetsInput = await screen.findByRole('spinbutton', { name: /Maximaal aantal te selecteren/i })

    expect(nameInput).toBeInTheDocument()
    expect(iconEntryInput).toBeInTheDocument()
    expect(iconEntryInput).toHaveValue('my-icon')
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
