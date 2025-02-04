'use server'

import { redirect } from 'next/navigation'

export const postAttachmentForm = async () =>
  // Delete all session cookies
  // const cookieStore = await cookies()
  // cookieStore.getAll().forEach((cookie) => {
  //   cookieStore.delete(cookie.name)
  // })

  redirect('/samenvatting')
