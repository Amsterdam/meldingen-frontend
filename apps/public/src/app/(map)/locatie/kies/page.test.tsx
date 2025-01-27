import { render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import Page from './page'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('Page', () => {
  it('should render', async () => {
    const { container } = render(<Page />)

    const outerWrapper = container.querySelector('div')

    waitFor(() => {
      expect(outerWrapper).toBeInTheDocument()
    })
  })
})
