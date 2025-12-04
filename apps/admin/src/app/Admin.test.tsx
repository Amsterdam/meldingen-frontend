import { render } from '@testing-library/react'

import { Admin } from './Admin'
import * as authOptionsModule from './providers/entraAuthProvider'

describe('Admin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Admin />)
    expect(baseElement).toBeTruthy()
  })

  it('should render successfully when isEntraAuthEnabled is false', () => {
    vi.spyOn(authOptionsModule, 'isEntraAuthEnabled', 'get').mockReturnValue(false)

    render(<Admin />)
  })
})
