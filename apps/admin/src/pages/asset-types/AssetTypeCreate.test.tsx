import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider } from 'react-admin'

import { AssetTypeCreate, transform } from './AssetTypeCreate'

describe('transform function', () => {
  it('should transform data correctly', () => {
    const inputData = {
      arguments: {
        base_url: 'https://example.com/wfs',
      },
      name: 'Test Asset Type',
    }

    const expectedTransformedData = {
      arguments: {
        base_url: 'https://example.com/wfs',
      },
      class_name: 'meldingen.wfs.ProxyWfsProviderFactory',
      name: 'Test Asset Type',
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
    const baseUrlInput = screen.getByRole('textbox', {
      name: 'resources.asset-type.fields.arguments.base_url',
    })

    expect(nameInput).toBeInTheDocument()
    expect(baseUrlInput).toBeInTheDocument()
  })
})
