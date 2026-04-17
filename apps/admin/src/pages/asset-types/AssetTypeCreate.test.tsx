import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider } from 'react-admin'

import { i18nProvider } from '../../app/providers/i18nProvider'
import { AssetTypeCreate, transform } from './AssetTypeCreate'

describe('transform function', () => {
  it('should transform data correctly', () => {
    const inputData = {
      arguments: {
        base_url: 'https://example.com/wfs',
        filter: 'my-filter',
        icon_entry: 'test-icon',
        icon_folder: 'test-folder',
        srs_name: 'EPSG:4326',
        type_names: 'Type name',
      },
      max_assets: 3,
      name: 'Test Asset Type',
    }

    const expectedTransformedData = {
      ...inputData,
      class_name: 'meldingen.wfs.ProxyWfsProviderFactory',
    }

    expect(transform(inputData)).toEqual(expectedTransformedData)
  })
})

describe('AssetTypeCreate', () => {
  it('should render all inputs', () => {
    render(
      <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="asset-type">
          <AssetTypeCreate />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const nameInput = screen.getByRole('textbox', { name: /Naam/i })
    const iconEntryInput = screen.getByRole('textbox', { name: /Icon koppelcode/i })
    const iconFolderInput = screen.getByRole('textbox', { name: /Icon folder/i })
    const typeNamesInput = screen.getByRole('textbox', { name: /Typenames/i })
    const srsNameInput = screen.getByRole('textbox', { name: /SRS name/i })
    const filterInput = screen.getByRole('textbox', { name: /Filter/i })
    const baseUrlInput = screen.getByRole('textbox', { name: /WFS url/i })
    const maxAssetsInput = screen.getByRole('spinbutton', { name: /Maximaal aantal te selecteren/i })

    expect(nameInput).toBeInTheDocument()
    expect(iconEntryInput).toBeInTheDocument()
    expect(iconFolderInput).toBeInTheDocument()
    expect(typeNamesInput).toBeInTheDocument()
    expect(srsNameInput).toBeInTheDocument()
    expect(filterInput).toBeInTheDocument()
    expect(baseUrlInput).toBeInTheDocument()
    expect(maxAssetsInput).toBeInTheDocument()
    expect(maxAssetsInput).toHaveValue(3)
  })
})
