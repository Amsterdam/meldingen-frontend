import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider } from 'react-admin'

import { AssetTypeCreate, transform } from './AssetTypeCreate'

describe('transform function', () => {
  it('should transform data correctly', () => {
    const inputData = {
      arguments: {
        base_url: 'https://example.com/wfs',
        filter: 'my-filter',
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
      <AdminContext>
        <ResourceContextProvider value="asset-type">
          <AssetTypeCreate />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const nameInput = screen.getByRole('textbox', { name: 'resources.asset-type.fields.name' })
    const typeNamesInput = screen.getByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.type_names',
    })
    const srsNameInput = screen.getByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.srs_name',
    })
    const filterInput = screen.getByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.filter',
    })
    const baseUrlInput = screen.getByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.base_url',
    })
    const maxAssetsInput = screen.getByRole('spinbutton', { name: 'resources.asset-type.fields.max_assets' })

    expect(nameInput).toBeInTheDocument()
    expect(typeNamesInput).toBeInTheDocument()
    expect(srsNameInput).toBeInTheDocument()
    expect(filterInput).toBeInTheDocument()
    expect(baseUrlInput).toBeInTheDocument()
    expect(maxAssetsInput).toBeInTheDocument()
    expect(maxAssetsInput).toHaveValue(3)
  })
})
