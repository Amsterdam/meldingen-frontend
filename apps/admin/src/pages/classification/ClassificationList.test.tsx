import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider } from 'react-admin'

import { ClassificationList } from './ClassificationList'

describe('ClassificationList', () => {
  it('renders', () => {
    render(
      <AdminContext>
        <ResourceContextProvider value="classification">
          <ClassificationList />
        </ResourceContextProvider>
      </AdminContext>,
    )

    const exportButton = screen.getByRole('button', { name: 'ra.action.export' })

    expect(exportButton).toBeInTheDocument()
  })
})
