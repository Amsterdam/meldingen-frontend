import { render, screen } from '@testing-library/react'
import { AdminContext } from 'react-admin'

import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('renders all fields and static labels', () => {
    render(
      <AdminContext>
        <ContactForm />
      </AdminContext>,
    )

    const emailLabel = screen.getByRole('textbox', { name: 'resources.undefined.fields.components[0].label' })
    const emailDescription = screen.getByRole('textbox', {
      name: 'resources.undefined.fields.components[0].description',
    })

    const telLabel = screen.getByRole('textbox', { name: 'resources.undefined.fields.components[1].label' })
    const telDescription = screen.getByRole('textbox', { name: 'resources.undefined.fields.components[1].description' })

    const submitButton = screen.getByRole('button', { name: 'ra.action.save' })

    expect(emailLabel).toBeInTheDocument()
    expect(emailDescription).toBeInTheDocument()
    expect(telLabel).toBeInTheDocument()
    expect(telDescription).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
})
