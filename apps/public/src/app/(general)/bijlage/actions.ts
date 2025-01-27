'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const postAttachmentForm = async () => {
  // Delete all session cookies
  const cookieStore = await cookies()
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name)
  })

  return redirect('/bedankt')
}
