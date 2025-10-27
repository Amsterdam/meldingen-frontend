import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider } from 'react-admin'

import { AssetTypeList } from './AssetTypeList'

describe('AssetTypeList', () => {
  it('renders', () => {
    render(
      <AdminContext>
        <ResourceContextProvider value="asset-type">
          <AssetTypeList />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const exportButton = screen.getByRole('button', { name: 'ra.action.export' })

    expect(exportButton).toBeInTheDocument()
  })
})
