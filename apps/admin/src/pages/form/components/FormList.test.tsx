import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider } from 'react-admin'

import { FormList } from './FormList'

describe('FormList', () => {
  it('renders', () => {
    render(
      <AdminContext>
        <ResourceContextProvider value="form">
          <FormList />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const exportButton = screen.getByRole('button', { name: 'ra.action.export' })

    expect(exportButton).toBeInTheDocument()
  })
})
