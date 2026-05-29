import { render, screen } from '@testing-library/react'

import { LabelsField } from './LabelsField'

const defaultProps = {
  labels: [
    { created_at: '2024-01-01T00:00:00Z', id: 1, name: 'Label 1', updated_at: '2024-01-01T00:00:00Z' },
    { created_at: '2024-01-01T00:00:00Z', id: 2, name: 'Label 2', updated_at: '2024-01-01T00:00:00Z' },
    { created_at: '2024-01-01T00:00:00Z', id: 3, name: 'Label 3', updated_at: '2024-01-01T00:00:00Z' },
  ],
}

describe('LabelsField', () => {
  it('renders all labels options', () => {
    render(<LabelsField {...defaultProps} />)

    expect(screen.getByRole('group', { name: 'labels-label' })).toBeInTheDocument()

    defaultProps.labels.forEach((label) => {
      expect(screen.getByRole('checkbox', { name: label.name })).toBeInTheDocument()
    })
  })
})
