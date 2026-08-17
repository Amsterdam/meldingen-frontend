import { render, screen } from '@testing-library/react'
import { AdminContext, ResourceContextProvider, SimpleForm } from 'react-admin'

import { BuilderInput } from './BuilderInput'

vi.mock('@meldingen/form-builder', () => ({
  FormBuilder: ({ data }: { data?: unknown[] }) => <div>{JSON.stringify(data ?? [])}</div>,
}))

const mockData = [
  {
    components: [
      {
        label: 'Eerste vraag',
        type: 'textfield',
      },
    ],
    input: false,
    key: 'page1',
    type: 'panel',
  },
]

const renderInput = (record?: Record<string, unknown>) =>
  render(
    <AdminContext>
      <ResourceContextProvider value="form">
        <SimpleForm record={record}>
          <BuilderInput />
        </SimpleForm>
      </ResourceContextProvider>
    </AdminContext>,
  )

describe('BuilderInput', () => {
  it('prefills the builder when the record is already available', async () => {
    renderInput({ components: mockData })

    expect(await screen.findByText(/Eerste vraag/)).toBeInTheDocument()
  })

  it('updates the builder when the record loads after mount', async () => {
    const { rerender } = renderInput()

    expect(screen.queryByText(/Eerste vraag/)).not.toBeInTheDocument()

    rerender(
      <AdminContext>
        <ResourceContextProvider value="form">
          <SimpleForm record={{ components: mockData }}>
            <BuilderInput />
          </SimpleForm>
        </ResourceContextProvider>
      </AdminContext>,
    )

    expect(await screen.findByText(/Eerste vraag/)).toBeInTheDocument()
  })
})
