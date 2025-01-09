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

// Set the backend address for use in the API client
OpenAPI.BASE = 'http://localhost:8000'

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="nl">
    <body>{children}</body>
  </html>
)

export default RootLayout
