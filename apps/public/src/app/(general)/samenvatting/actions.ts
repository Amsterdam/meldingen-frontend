'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const postSummaryForm = async () => {
  const cookieStore = await cookies()

  // Delete location, token and lastPanelpath cookies
  ;['location', 'token', 'lastPanelPath'].forEach((cookie) => {
    cookieStore.delete(cookie)
  })

  return redirect('/bedankt')
}
