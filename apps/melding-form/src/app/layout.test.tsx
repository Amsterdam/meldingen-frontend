import { generateMetadata } from './layout'

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ description: 'description' })
  })
})
