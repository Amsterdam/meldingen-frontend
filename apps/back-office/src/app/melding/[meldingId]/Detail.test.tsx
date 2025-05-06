import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'
import { Mock, vi } from 'vitest'

import { Detail } from './Detail'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
    startTransition: vi.fn((callback) => callback()),
  }
})

const defaultProps = {
  meldingData: [
    { key: '1', term: 'Term 1', description: 'Description 1' },
    { key: '2', term: 'Term 2', description: 'Description 2' },
  ],
  meldingId: 123,
  meldingState: 'processing',
}

describe('Detail', () => {
  it('renders the component with melding data', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByText('Term 1')).toBeInTheDocument()
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('Term 2')).toBeInTheDocument()
    expect(screen.getByText('Description 2')).toBeInTheDocument()
  })

  it('renders the select field with the correct options', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByRole('combobox', { name: 'label' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'options.default' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'options.processing' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'options.completed' })).toBeInTheDocument()
  })

  it('sets the default value of the select field if melding state is valid', () => {
    render(<Detail {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    expect(select).toHaveValue('processing')
  })

  it('does not set the default value of the select field if melding state is invalid', () => {
    const invalidProps = { ...defaultProps, meldingState: 'invalid' }
    render(<Detail {...invalidProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    expect(select).toHaveValue('')
  })

  it('calls changeStateAction when a valid state is selected', async () => {
    const user = userEvent.setup()

    const mockChangeStateAction = vi.fn()
    ;(useActionState as Mock).mockReturnValue([{}, mockChangeStateAction])

    render(<Detail {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    await user.selectOptions(select, 'completed')

    expect(mockChangeStateAction).toHaveBeenCalledWith({
      id: 123,
      state: 'completed',
    })
  })

  it('does not call changeStateAction when an invalid state is selected', async () => {
    const user = userEvent.setup()

    const mockChangeStateAction = vi.fn()
    ;(useActionState as Mock).mockReturnValue([{}, mockChangeStateAction])

    render(<Detail {...defaultProps} />)

    const select = screen.getByLabelText('label')
    await user.selectOptions(select, '')

    expect(mockChangeStateAction).not.toHaveBeenCalled()
  })

  it('displays an error message when changeStateError is present', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Error message' }, vi.fn()])

    render(<Detail {...defaultProps} />)

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })
})
