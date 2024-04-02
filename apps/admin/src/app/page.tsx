'use client'

import dynamic from 'next/dynamic'

const Admin = dynamic(() => import('./_components/Admin').then((mod) => mod.Admin), { ssr: false })

const Home = () => (
  <main>
    <Admin />
  </main>
)

export default Home
