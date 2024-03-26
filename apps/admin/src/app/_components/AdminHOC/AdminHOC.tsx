'use client'

import dynamic from 'next/dynamic'

const AdminApp = dynamic(() => import('../AdminApp/AdminApp').then((mod) => mod.AdminApp), { ssr: false })

export function AdminHOC({ data }: any) {
  return <AdminApp data={data} />
}
