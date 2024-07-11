'use client'

import dynamic from 'next/dynamic'

const Admin = dynamic(() => import('../components/admin/Admin').then((mod) => mod.Admin), { ssr: false })

const Home = () => (
  <main>
    <Admin />
  </main>
)

export default Home
