import { http, HttpResponse } from 'msw'
import { createTranslator } from 'next-intl'

import messages from '../../../../../translations/nl.json'
import { getMeldingTitle } from './getMeldingTitle'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('next-intl/server', () => ({
  getTranslations: (namespace: 'detail') => createTranslator({ locale: 'nl', messages, namespace }),
}))

describe('getMeldingTitle', () => {
  it('returns the translated title containing the public id', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({ public_id: 'B100AA' })))

    expect(await getMeldingTitle('123')).toBe('Melding B100AA - Gemeente Amsterdam')
  })

  it.each([null, undefined, ''])('returns the fallback title when the public id is %s', async (publicId) => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({ public_id: publicId })))

    expect(await getMeldingTitle('123')).toBe('Melding - Gemeente Amsterdam')
  })

  it('returns the fallback title when the API returns an error without data', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () =>
        HttpResponse.json({ detail: 'Something went wrong' }, { status: 500 }),
      ),
    )

    expect(await getMeldingTitle('123')).toBe('Melding - Gemeente Amsterdam')
  })
})
