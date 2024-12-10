'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./_components/BaseLayer').then((module) => module.BaseLayer), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const KiesLocatie = () => <Map />

export default KiesLocatie
