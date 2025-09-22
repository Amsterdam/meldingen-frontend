import { render } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { Detail } from './Detail'
import Page, { generateMetadata } from './page'
import { getFullNLAddress } from '../../utils'
import { additionalQuestions, melding } from 'apps/back-office/src/mocks/data'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

vi.mock('./Detail', () => ({
  Detail: vi.fn(() => <div>Detail Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata({ searchParams: Promise.resolve({ id: 'AA123B' }) })

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('returns an error message when getMeldingByMeldingId return an error or no data', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({}, { status: 500 })))

    const params = Promise.resolve({ meldingId: 123 })
    const result = await Page({ params })

    const { getByText } = render(result)

    expect(getByText('errors.melding-not-found')).toBeInTheDocument()
  })

  it('returns an error message when getMeldingByMeldingIdAnswers returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const params = Promise.resolve({ meldingId: 123 })
    const result = await Page({ params })

    const { getByText } = render(result)

    expect(getByText('Error message')).toBeInTheDocument()
  })

  it('calls the Detail component with the correct data', async () => {
    const params = Promise.resolve({ meldingId: 123 })
    const result = await Page({ params })

    render(result)

    const { id, created_at, classification, email, phone, public_id } = melding

    const additionalQuestionsWithMeldingText = [
      {
        description: melding.text,
        key: 'text',
        term: 'detail.melding-text',
      },
      {
        description: additionalQuestions[0].text,
        key: additionalQuestions[0].question.id.toString(),
        term: additionalQuestions[0].question.text,
      },
      {
        description: additionalQuestions[1].text,
        key: additionalQuestions[1].question.id.toString(),
        term: additionalQuestions[1].question.text,
      },
    ]

    const contact = [
      { key: 'email', term: 'detail.contact.email', description: email },
      { key: 'phone', term: 'detail.contact.phone', description: phone },
    ]

    const location = [
      {
        description: getFullNLAddress(melding),
        key: 'address',
        term: 'detail.location.address',
      },
    ]

    const meldingData = [
      {
        key: 'created_at',
        term: 'detail.melding-data.created_at',
        description: new Date(created_at).toLocaleDateString('nl-NL'),
      },
      {
        key: 'classification',
        term: 'detail.melding-data.classification',
        description: classification!.name,
      },
      {
        key: 'state',
        term: 'detail.melding-data.state.term',
        description: 'shared.state.questions_answered',
        link: {
          href: `/melding/${id}/wijzig-status`,
          label: 'detail.melding-data.state.link',
        },
      },
    ]

    expect(Detail).toHaveBeenCalledWith(
      {
        additionalQuestionsWithMeldingText: additionalQuestionsWithMeldingText,
        contact: contact,
        location: location,
        meldingData: meldingData,
        publicId: public_id,
      },
      undefined,
    )
  })
})
