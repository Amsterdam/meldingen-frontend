'use client'

import dynamic from 'next/dynamic'
import { SessionProvider } from 'next-auth/react'

const Admin = dynamic(() => import('../components/admin/Admin').then((mod) => mod.Admin), { ssr: false })

const Home = () => (
  <main>
    <SessionProvider>
      <Admin />
    </SessionProvider>
  </main>
)

export default Home
