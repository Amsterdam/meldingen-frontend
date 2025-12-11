import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { PointSelectLayer } from './PointSelectLayer'

describe('PointSelectLayer', () => {
  it('renders Crosshair', () => {
    const { container } = render(<PointSelectLayer hideSelectedPoint={false} onSelectedPointChange={vi.fn()} />)

    const crosshair = container.querySelector('#crosshair')

    expect(crosshair).toBeInTheDocument()
  })
})
