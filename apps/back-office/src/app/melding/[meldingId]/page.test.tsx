import { formatMeldingData, generateMetadata } from './page'

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ meldingId: 123 }) })

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('formatMeldingData', () => {
  it('formats the melding data correctly', async () => {
    const data = {
      id: 123,
      public_id: 'AB123',
      text: 'Test melding',
      created_at: '2023-10-01T00:00:00Z',
      updated_at: '2023-10-01T00:00:00Z',
      classification: 1,
      state: 'Test state',
      geo_location: null,
      email: 'email@email.email',
      phone: '0612345678',
    }

    const formattedData = await formatMeldingData(data)

    expect(formattedData).toEqual([
      { key: 'text', term: 'text', description: 'Test melding' },
      { key: 'created_at', term: 'created_at', description: '1-10-2023' },
      { key: 'classification', term: 'classification', description: '1' },
      { key: 'state', term: 'state', description: 'Test state' },
      { key: 'geo_location', term: 'geo_location', description: 'null' },
      { key: 'email', term: 'email', description: 'email@email.email' },
      { key: 'phone', term: 'phone', description: '0612345678' },
    ])
  })
})
