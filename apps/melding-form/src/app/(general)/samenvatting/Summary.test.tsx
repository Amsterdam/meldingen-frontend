import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { Summary } from './Summary'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  additionalQuestions: [
    {
      key: '1',
      term: 'Text Field 1',
      description: 'Antwoord vraag 1',
      link: '/link/to/page',
    },
    {
      key: '2',
      term: 'Text Area 2',
      description: 'Antwoord vraag 2',
      link: '/link/to/page',
    },
  ],
  attachments: {
    files: [
      {
        blob: { size: 4326, type: 'image/webp' } as Blob,
        contentType: 'image/webp',
        fileName: 'IMG_0815.jpg',
      },
    ],
    key: 'attachments',
    term: 'Foto’s',
  },
  contact: {
    key: 'contact',
    term: 'Wat zijn uw contactgegevens?',
    description: ['test@test.com', '+31612345678'],
  },
  location: {
    key: 'location',
    term: 'Waar staat de container?',
    description: 'Nieuwmarkt 247, 1011MB Amsterdam',
  },
  primaryForm: {
    key: 'primary',
    term: 'Wat wilt u melden?',
    description: 'Er ligt heel veel afval op straat.',
  },
}

global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/uploaded-file-1')
global.URL.revokeObjectURL = vi.fn()

describe('Summary', () => {
  it('renders the back link', () => {
    render(<Summary {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'back-link' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/contact')
  })

  it('renders the Summary component with data', () => {
    render(<Summary {...defaultProps} />)

    const terms = screen.getAllByRole('term')
    const definitions = screen.getAllByRole('definition')

    expect(terms[0]).toHaveTextContent('Wat wilt u melden?')
    expect(terms[1]).toHaveTextContent('Text Field 1')
    expect(terms[2]).toHaveTextContent('Text Area 2')
    expect(terms[3]).toHaveTextContent('Waar staat de container?')
    expect(terms[4]).toHaveTextContent('Foto’s')
    expect(terms[5]).toHaveTextContent('Wat zijn uw contactgegevens?')

    expect(definitions[0]).toHaveTextContent('Er ligt heel veel afval op straat.')
    expect(definitions[2]).toHaveTextContent('Antwoord vraag 1')
    expect(definitions[4]).toHaveTextContent('Antwoord vraag 2')
    expect(definitions[6]).toHaveTextContent('Nieuwmarkt 247, 1011MB Amsterdam')
    expect(definitions[8]).toHaveTextContent('IMG_0815.jpg')
    expect(definitions[10]).toHaveTextContent('test@test.com')
    expect(definitions[11]).toHaveTextContent('+31612345678')

    expect(screen.getByRole('button', { name: 'submit-button' }))
  })

  it('renders the change links', () => {
    render(<Summary {...defaultProps} />)

    const primaryChangeLink = screen.getByRole('link', { name: 'change-links.primary' })
    const additionalChangeLinks = screen.getAllByRole('link', { name: 'change-links.additional' })
    const locationChangeLink = screen.getByRole('link', { name: 'change-links.location' })
    const attachmentsChangeLink = screen.getByRole('link', { name: 'change-links.attachments' })
    const contactChangeLink = screen.getByRole('link', { name: 'change-links.contact' })

    expect(primaryChangeLink).toBeInTheDocument()
    expect(primaryChangeLink).toHaveAttribute('href', '/')

    expect(additionalChangeLinks).toHaveLength(2)
    expect(additionalChangeLinks[0]).toHaveAttribute('href', '/link/to/page')
    expect(additionalChangeLinks[1]).toHaveAttribute('href', '/link/to/page')

    expect(locationChangeLink).toBeInTheDocument()
    expect(locationChangeLink).toHaveAttribute('href', '/locatie')

    expect(attachmentsChangeLink).toBeInTheDocument()
    expect(attachmentsChangeLink).toHaveAttribute('href', '/bijlage')

    expect(contactChangeLink).toBeInTheDocument()
    expect(contactChangeLink).toHaveAttribute('href', '/contact')
  })

  it('renders the Summary component with an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ systemError: 'Test error message' }, vi.fn()])

    render(<Summary {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')
  })
})
