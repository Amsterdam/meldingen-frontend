import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminContext } from 'react-admin'
import { FormProvider, useForm } from 'react-hook-form'

import { PrimaryForm } from './PrimaryForm'

describe('PrimaryForm', () => {
  it('renders all fields and static labels', async () => {
    const user = userEvent.setup()

    const mockGetValues = vi.fn()
    const mockSetValue = vi.fn()

    const PrimaryFormWithContext = () => {
      const methods = useForm()

      return (
        <FormProvider {...{ ...methods, getValues: mockGetValues, setValue: mockSetValue }}>
          <AdminContext>
            <PrimaryForm />
          </AdminContext>
        </FormProvider>
      )
    }

    render(<PrimaryFormWithContext />)

    const label = screen.getByRole('textbox', { name: 'resources.undefined.fields.components[0].label' })
    const description = screen.getByRole('textbox', {
      name: 'resources.undefined.fields.components[0].description',
    })
    const maxCharCount = screen.getByRole('textbox', {
      name: 'resources.undefined.fields.components[0].maxCharCount',
    })
    const maxCharCountErrorMessage = screen.getByText('resources.undefined.fields.components[0].validate.json.if[2]')
    const submitButton = screen.getByRole('button', { name: 'ra.action.save' })

    await user.type(maxCharCount, '100')

    expect(label).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(maxCharCount).toBeInTheDocument()
    expect(maxCharCountErrorMessage).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('calls getValues and setValue when maxCharCount changes', async () => {
    const user = userEvent.setup()

    const mockGetValues = vi.fn()
    const mockSetValue = vi.fn()

    const PrimaryFormWithContext = () => {
      const methods = useForm()

      return (
        <FormProvider {...{ ...methods, getValues: mockGetValues, setValue: mockSetValue }}>
          <AdminContext>
            <PrimaryForm />
          </AdminContext>
        </FormProvider>
      )
    }

    render(<PrimaryFormWithContext />)

    const maxCharCount = screen.getByRole('textbox', {
      name: 'resources.undefined.fields.components[0].maxCharCount',
    }) as HTMLInputElement

    await user.type(maxCharCount, '100')

    expect(mockGetValues).toHaveBeenCalled()
    expect(mockSetValue).toHaveBeenCalled()
  })
})
