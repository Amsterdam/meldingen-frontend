'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { COOKIES } from '~/constants'

export const clearSession = async () => {
  const cookieStore = await cookies()

  if (!cookieStore.has(COOKIES.ID) && !cookieStore.has(COOKIES.TOKEN)) return

  Object.values(COOKIES).forEach((cookie) => {
    cookieStore.delete(cookie)
  })

  return redirect('/')
}
