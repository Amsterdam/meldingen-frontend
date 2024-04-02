'use client'

import dynamic from 'next/dynamic'

const AdminApp = dynamic(() => import('../AdminApp/AdminApp').then((mod) => mod.AdminApp), { ssr: false })

export const AdminHOC = ({ data }: any) => <AdminApp data={data} />
