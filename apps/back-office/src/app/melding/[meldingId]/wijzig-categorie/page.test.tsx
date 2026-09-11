import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import Page from './page'
import * as apiClientProxy from '~/app/_api-client/proxy'

vi.mock('./ChangeCategory', () => ({
  ChangeCategory: vi.fn(() => <div>ChangeCategory Component</div>),
}))

describe('Page', () => {
  it('throws an error when melding data is not available', async () => {
    const meldingSpy = vi.spyOn(apiClientProxy, 'getMeldingByMeldingId').mockResolvedValue({
      error: { detail: 'Error message' },
    } as Awaited<ReturnType<typeof apiClientProxy.getMeldingByMeldingId>>)

    const params = Promise.resolve({ meldingId: '123' })

    await expect(Page({ params })).rejects.toThrowError('Failed to fetch melding data.')

    meldingSpy.mockRestore()
  })

  it('throws an error when classifications are not available', async () => {
    const meldingSpy = vi.spyOn(apiClientProxy, 'getMeldingByMeldingId').mockResolvedValue({
      data: {
        classification: { id: 2, name: 'Test classification' },
        public_id: 'ABC',
        state: 'processing',
      },
      error: undefined,
    } as Awaited<ReturnType<typeof apiClientProxy.getMeldingByMeldingId>>)
    const classificationsSpy = vi.spyOn(apiClientProxy, 'getClassification').mockResolvedValue({
      error: { detail: 'Error message' },
    } as Awaited<ReturnType<typeof apiClientProxy.getClassification>>)

    const params = Promise.resolve({ meldingId: '123' })

    await expect(Page({ params })).rejects.toThrowError('Failed to fetch classifications.')

    classificationsSpy.mockRestore()
    meldingSpy.mockRestore()
  })

  it('redirects when the melding state does not allow reclassification', async () => {
    const meldingSpy = vi.spyOn(apiClientProxy, 'getMeldingByMeldingId').mockResolvedValue({
      data: {
        classification: { id: 2, name: 'Test classification' },
        public_id: 'ABC',
        state: 'completed',
      },
      error: undefined,
    } as Awaited<ReturnType<typeof apiClientProxy.getMeldingByMeldingId>>)
    const classificationsSpy = vi.spyOn(apiClientProxy, 'getClassification').mockResolvedValue({
      data: [
        {
          created_at: '2024-01-01T00:00:00Z',
          id: 2,
          name: 'Test classification',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      error: undefined,
    } as Awaited<ReturnType<typeof apiClientProxy.getClassification>>)

    const params = Promise.resolve({ meldingId: '123' })

    await Page({ params })

    expect(redirect).toHaveBeenCalledWith('/melding/123')

    classificationsSpy.mockRestore()
    meldingSpy.mockRestore()
  })

  it('renders the ChangeCategory component when data is available', async () => {
    const meldingSpy = vi.spyOn(apiClientProxy, 'getMeldingByMeldingId').mockResolvedValue({
      data: {
        classification: { id: 2, name: 'Test classification' },
        public_id: 'ABC',
        state: 'processing',
      },
      error: undefined,
    } as Awaited<ReturnType<typeof apiClientProxy.getMeldingByMeldingId>>)
    const classificationsSpy = vi.spyOn(apiClientProxy, 'getClassification').mockResolvedValue({
      data: [
        {
          created_at: '2024-01-01T00:00:00Z',
          id: 2,
          name: 'Test classification',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      error: undefined,
    } as Awaited<ReturnType<typeof apiClientProxy.getClassification>>)

    const params = Promise.resolve({ meldingId: '123' })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('ChangeCategory Component')).toBeInTheDocument()

    classificationsSpy.mockRestore()
    meldingSpy.mockRestore()
  })
})
