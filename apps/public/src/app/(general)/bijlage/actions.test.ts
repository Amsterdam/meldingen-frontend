import { cookies } from 'next/headers'
import { Mock } from 'vitest'

import { postAttachmentForm } from './actions'
import { postMeldingByMeldingIdAttachment } from '@meldingen/api-client'

vi.mock('@meldingen/api-client', () => ({
  postMeldingByMeldingIdAttachment: vi.fn(),
  getMeldingByMeldingIdAttachments: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('actions', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  describe('postAttachmentForm', () => {
    it('should post all files', async () => {
      mockCookies.get.mockImplementation((name) => {
        if (name === 'id') {
          return { value: '21' }
        }
        if (name === 'token') {
          return { value: 'z123890' }
        }
        return undefined
      })

      const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
      const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

      const fileList = [file, file2] as unknown as FileList

      await postAttachmentForm(fileList)

      expect(postMeldingByMeldingIdAttachment).toHaveBeenCalledTimes(2)
      expect(postMeldingByMeldingIdAttachment).toHaveBeenCalledWith({
        formData: { file },
        meldingId: 21,
        token: 'z123890',
      })
      expect(postMeldingByMeldingIdAttachment).toHaveBeenCalledWith({
        formData: { file: file2 },
        meldingId: 21,
        token: 'z123890',
      })
    })

    it('should catch an error', async () => {
      const mockError = { message: 'Something went terribly wrong' }
      ;(postMeldingByMeldingIdAttachment as Mock).mockRejectedValueOnce(mockError)

      mockCookies.get.mockImplementation((name) => {
        if (name === 'id') {
          return { value: '21' }
        }
        if (name === 'token') {
          return { value: 'z123890' }
        }
        return undefined
      })

      const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
      const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

      const fileList = [file, file2] as unknown as FileList

      const result = await postAttachmentForm(fileList)

      expect(result).toEqual(mockError)
    })

    it('should return undefined when there is no meldingId', async () => {
      mockCookies.get.mockImplementation((name) => {
        if (name === 'id') {
          return { value: undefined }
        }
        if (name === 'token') {
          return { value: 'z123890' }
        }
        return undefined
      })

      const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
      const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

      const fileList = [file, file2] as unknown as FileList

      const result = await postAttachmentForm(fileList)

      expect(result).toBe(undefined)
    })

    it('should return undefined when there is no token', async () => {
      mockCookies.get.mockImplementation((name) => {
        if (name === 'id') {
          return { value: '21' }
        }
        if (name === 'token') {
          return { value: undefined }
        }
        return undefined
      })

      const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
      const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

      const fileList = [file, file2] as unknown as FileList

      const result = await postAttachmentForm(fileList)

      expect(result).toBe(undefined)
    })
  })
})
