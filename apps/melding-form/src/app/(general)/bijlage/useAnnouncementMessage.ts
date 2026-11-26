import { useEffect, useState } from 'react'

import type { Announcement } from '@meldingen/file-upload'

// Clear the message after a while, so screen-reader users don't come across an outdated message when reading the page
export const ANNOUNCEMENT_CLEAR_DELAY_MS = 5000

type Message = {
  id: number
  text?: string
}

/**
 * Turns the latest announcement into a message for a status region.
 *
 * The text is created once per announcement. Later changes, such as the number of uploaded files,
 * do not change it, because a changing text would be announced again.
 * Render the returned text in an element with `key={id}`, so an identical text is announced again too.
 */
export const useAnnouncementMessage = (
  announcement: Announcement | undefined,
  getText: (announcement: Announcement) => string,
) => {
  const [message, setMessage] = useState<Message>()

  if (announcement && announcement.id !== message?.id) {
    setMessage({ id: announcement.id, text: getText(announcement) })
  }

  useEffect(() => {
    if (!message?.text) return

    const timeout = setTimeout(() => setMessage({ id: message.id }), ANNOUNCEMENT_CLEAR_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [message])

  return message?.text ? { id: message.id, text: message.text } : undefined
}
