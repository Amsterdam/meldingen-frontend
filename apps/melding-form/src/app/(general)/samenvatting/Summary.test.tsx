import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import { vi } from 'vitest'

import { Summary } from './Summary'
import { TOP_ANCHOR_ID } from '~/constants'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  }
})

const defaultProps = {
  action: vi.fn(),
  additionalQuestions: [
    {
      description: 'Antwoord vraag 1',
      key: '1',
      link: '/link/to/page',
      term: 'Text Field 1',
    },
    {
      description: 'Antwoord vraag 2',
      key: '2',
      link: '/link/to/page',
      term: 'Text Area 2',
    },
  ],
  assets: {
    data: [
      {
        icon: { entry: 'fractie_omschrijving', folder: 'container' },
        id: 'container.1',
        label: 'Asset 1',
        subtype: 'containers',
      },
      {
        icon: { entry: 'fractie_omschrijving', folder: 'container' },
        id: 'container.2',
        label: 'Asset 2',
        subtype: 'containers',
      },
    ],
    name: 'Containers',
    term: 'Waar staat de container?',
  },
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
    description: ['test@test.com', '+31612345678'],
    key: 'contact',
    term: 'Wat zijn uw contactgegevens?',
  },
  location: {
    description: 'Nieuwmarkt 247, 1011MB Amsterdam',
    key: 'location',
    term: 'Waar staat de container?',
  },
  primaryForm: {
    description: 'Er ligt heel veel afval op straat.',
    key: 'primary',
    term: 'Wat wilt u melden?',
  },
  primaryFormLink: `/#${TOP_ANCHOR_ID}`,
}

global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/uploaded-file-1')
global.URL.revokeObjectURL = vi.fn()

describe('Summary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with the correct document title', () => {
    render(<Summary {...defaultProps} />)

    expect(document.title).toBe(`main-title - organisation-name`)
  })

  it('renders the back link', () => {
    render(<Summary {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'back-link' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `/contact#${TOP_ANCHOR_ID}`)
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
    const locationChangeLink = screen.getByRole('link', { name: 'change-links.assets' })
    const attachmentsChangeLink = screen.getByRole('link', { name: 'change-links.attachments' })
    const contactChangeLink = screen.getByRole('link', { name: 'change-links.contact' })

    expect(primaryChangeLink).toBeInTheDocument()
    expect(primaryChangeLink).toHaveAttribute('href', `/#${TOP_ANCHOR_ID}`)

    expect(additionalChangeLinks).toHaveLength(2)
    expect(additionalChangeLinks[0]).toHaveAttribute('href', '/link/to/page')
    expect(additionalChangeLinks[1]).toHaveAttribute('href', '/link/to/page')

    expect(locationChangeLink).toBeInTheDocument()
    expect(locationChangeLink).toHaveAttribute('href', `/locatie#${TOP_ANCHOR_ID}`)

    expect(attachmentsChangeLink).toBeInTheDocument()
    expect(attachmentsChangeLink).toHaveAttribute('href', `/bijlage#${TOP_ANCHOR_ID}`)

    expect(contactChangeLink).toBeInTheDocument()
    expect(contactChangeLink).toHaveAttribute('href', `/contact#${TOP_ANCHOR_ID}`)
  })

  it('hides optional sections when no additional questions, attachments, or contact details are available', () => {
    render(
      <Summary
        {...defaultProps}
        additionalQuestions={[]}
        attachments={{ ...defaultProps.attachments, files: [] }}
        contact={undefined}
      />,
    )

    expect(screen.queryByText('Text Field 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Text Area 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Foto’s')).not.toBeInTheDocument()
    expect(screen.queryByText('Wat zijn uw contactgegevens?')).not.toBeInTheDocument()

    expect(screen.queryByRole('link', { name: 'change-links.additional' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'change-links.attachments' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'change-links.contact' })).not.toBeInTheDocument()
  })

  it('falls back to the location term and generic location change link when no assets are available', () => {
    render(
      <Summary
        {...defaultProps}
        assets={{
          ...defaultProps.assets,
          data: [],
          name: undefined,
          term: undefined,
        }}
      />,
    )

    expect(screen.getByText(defaultProps.location.term)).toBeInTheDocument()

    const locationChangeLink = screen.getByRole('link', { name: 'change-links.location' })

    expect(locationChangeLink).toBeInTheDocument()
    expect(locationChangeLink).toHaveAttribute('href', `/locatie#${TOP_ANCHOR_ID}`)

    expect(screen.queryByRole('link', { name: 'change-links.assets' })).not.toBeInTheDocument()
    expect(screen.queryByText('Asset 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Asset 2')).not.toBeInTheDocument()
  })

  it('renders the Summary component with an error message', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: 'Test error message' }, vi.fn(), false])

    const { container } = render(<Summary {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveTextContent('heading')
  })

  it('updates the document title when there is an API error', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: 'Test error message' }, vi.fn(), false])

    render(<Summary {...defaultProps} />)

    expect(document.title).toBe('api-error-alert.heading - main-title - organisation-name')
  })
})
