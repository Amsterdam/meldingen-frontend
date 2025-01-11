import { OpenAPI } from '@meldingen/api-client'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@amsterdam/design-system-tokens/dist/index.css'
import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'

import './global.css'

export const metadata: Metadata = {
  title: 'Meldingen',
}

if (process.env.NEXT_PUBLIC_BACKEND_BASE_URL !== undefined) {
  // Set the backend address for use in the API client on the client side
  OpenAPI.BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="nl">
    <body>{children}</body>
  </html>
)

export default RootLayout
