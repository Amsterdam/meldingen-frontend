import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminContext } from 'react-admin'

import { PrimaryForm } from './PrimaryForm'

const mockGetValues = vi.fn()
const mockSetValue = vi.fn()

vi.mock('react-hook-form', async () => {
  const actual = await import('react-hook-form')

  return {
    ...actual,
    useFormContext: () => ({
      getValues: mockGetValues,
      setValue: mockSetValue,
    }),
  }
})

describe('PrimaryForm', () => {
  it('renders all fields and static labels', async () => {
    render(
      <AdminContext>
        <PrimaryForm />
      </AdminContext>,
    )

    const label = await screen.findByRole('textbox', { name: 'resources.undefined.fields.components[0].label' })
    const description = screen.getByRole('textbox', {
      name: 'resources.undefined.fields.components[0].description',
    })
    const maxCharCount = screen.getByRole('textbox', {
      name: 'resources.undefined.fields.components[0].maxCharCount',
    })
    const maxCharCountErrorMessage = screen.getByText('resources.undefined.fields.components[0].validate.json.if[2]')
    const submitButton = screen.getByRole('button', { name: 'ra.action.save' })

    expect(label).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(maxCharCount).toBeInTheDocument()
    expect(maxCharCountErrorMessage).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('calls getValues and setValue when maxCharCount changes', async () => {
    const user = userEvent.setup()

    render(
      <AdminContext>
        <PrimaryForm />
      </AdminContext>,
    )

    const maxCharCount = screen.getByRole('textbox', {
      name: 'resources.undefined.fields.components[0].maxCharCount',
    }) as HTMLInputElement

    await user.type(maxCharCount, '100')

    expect(mockGetValues).toHaveBeenCalled()
    expect(mockSetValue).toHaveBeenCalled()
  })
})
