import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider } from 'react-admin'

import { StaticFormList } from './StaticFormList'

describe('StaticFormList', () => {
  it('renders', () => {
    render(
      <AdminContext>
        <ResourceContextProvider value="static-form">
          <StaticFormList />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const exportButton = screen.getByRole('button', { name: 'ra.action.export' })

    expect(exportButton).toBeInTheDocument()
  })
})
