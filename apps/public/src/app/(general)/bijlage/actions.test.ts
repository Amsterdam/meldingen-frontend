import { redirectToNextPage } from './actions'
import { redirect } from 'next/navigation'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('redirectToNextPage', () => {
  it('should redirect to next page', () => {
    redirectToNextPage()

    expect(redirect).toBeCalledWith('/contact')
  })
})
