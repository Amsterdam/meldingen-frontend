import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider } from 'react-admin'

import { AssetTypeCreate, transform } from './AssetTypeCreate'

describe('transform function', () => {
  it('transforms data correctly', () => {
    const inputData = {
      arguments: { some_field: 'https://example.com/wfs' },
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
  it('renders', () => {
    render(
      <AdminContext>
        <ResourceContextProvider value="asset-type">
          <AssetTypeCreate />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const nameInput = screen.getByRole('textbox', { name: 'resources.asset-type.fields.name' })

    expect(nameInput).toBeInTheDocument()
  })
})
