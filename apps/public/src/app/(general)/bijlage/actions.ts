'use server'

import { postMeldingByMeldingIdAttachment } from '@meldingen/api-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const postAttachmentForm = async (fileList: FileList) => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')
  const token = cookieStore.get('token')

  if (!meldingId || !token) return undefined

  const files = Array.from(fileList)

  try {
    return await Promise.all(
      files.map((file) =>
        postMeldingByMeldingIdAttachment({
          formData: { file },
          meldingId: Number(meldingId.value),
          token: token.value,
        }),
      ),
    )
  } catch (error) {
    return { message: (error as Error).message }
  }
}

export const redirectToNextPage = async () => redirect('/contact')
