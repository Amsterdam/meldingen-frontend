'use server'

import { getMeldingByMeldingIdAttachments, postMeldingByMeldingIdAttachment } from '@meldingen/api-client'
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

export const redirectToNextPage = async (formData: FormData) => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')
  const token = cookieStore.get('token')

  if (!meldingId || !token) return undefined

  const uploadedFiles = await getMeldingByMeldingIdAttachments({
    meldingId: Number(meldingId.value),
    token: token.value,
  })

  // This is a fallback when JavaScript is disabled/not working
  if (uploadedFiles.length === 0) {
    const files = formData.getAll('file') as File[]
    try {
      await Promise.all(
        files.map((file) =>
          postMeldingByMeldingIdAttachment({
            formData: { file },
            meldingId: Number(meldingId.value),
            token: token.value,
          }),
        ),
      )
    } catch (error) {
      throw new Error((error as Error).message)
    }
    redirect('/contact')
  } else {
    const currentFiles = formData.getAll('file') as File[]

    const newFiles = currentFiles.filter((newFile) =>
      uploadedFiles.some((file) => file.original_filename !== newFile.name),
    )

    if (newFiles.length > 0) {
      try {
        await Promise.all(
          newFiles.map((file) =>
            postMeldingByMeldingIdAttachment({
              formData: { file },
              meldingId: Number(meldingId.value),
              token: token.value,
            }),
          ),
        )
      } catch (error) {
        throw new Error((error as Error).message)
      }
      redirect('/contact')
    }

    redirect('/contact')
  }
}
