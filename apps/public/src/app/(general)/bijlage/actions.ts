'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const postAttachmentForm = async () => {
  // Delete session cookies
  const cookieStore = await cookies()
  cookieStore.delete('id')
  cookieStore.delete('token')

  return redirect('/bedankt')
}
