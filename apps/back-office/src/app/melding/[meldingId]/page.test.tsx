import { render } from '@testing-library/react'
import { client } from 'libs/api-client/src/client.gen'

import { Detail } from './Detail'
import Page, { generateMetadata } from './page'
import { additionalQuestions, melding } from 'apps/back-office/src/mocks/data'

vi.mock('./Detail', () => ({
  Detail: vi.fn(() => <div>Detail Component</div>),
}))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({})),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Vitest doesn't seem to pick up env vars in this app, for some reason.
// So we set a mock base URL directly in the test.
client.setConfig({
  baseUrl: 'http://localhost:3000',
})

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ meldingId: 123 }) })

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('calls the Detail component with the correct data', async () => {
    const params = Promise.resolve({ meldingId: 123 })
    const result = await Page({ params })

    render(result)

    const { created_at, classification, state, email, phone } = melding

    const meldingData = [
      { key: 'created_at', term: 'created_at', description: new Date(created_at).toLocaleDateString('nl-NL') },
      { key: 'classification', term: 'classification', description: String(classification) },
      { key: 'state', term: 'state', description: state },
    ]

    const additionalQuestionsWithMeldingText = [
      {
        description: melding.text,
        key: 'text',
        term: 'term.text',
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
      { key: 'email', term: 'term.email', description: email },
      { key: 'phone', term: 'term.phone', description: phone },
    ]

    expect(Detail).toHaveBeenCalledWith(
      {
        additionalQuestionsWithMeldingText: additionalQuestionsWithMeldingText,
        contact: contact,
        meldingData: meldingData,
        meldingId: 123,
        meldingState: state,
      },
      {},
    )
  })
})
