import type { Metadata } from 'next'

// import '@amsterdam/design-system-tokens/dist/index.css'
// import '@amsterdam/design-system-assets/font/index.css'
// import '@amsterdam/design-system-css/dist/index.css'

import '../global.css'

export const metadata: Metadata = {
  title: 'Meldingen',
}

const MapLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="nl">
    <body>
      <main>{children}</main>
    </body>
  </html>
)

export default MapLayout
