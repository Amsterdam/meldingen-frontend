import { useState } from 'react'

const getData = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export const useFetch = () => {
  const [data, setData] = useState(null)

  const fetchData = async (url: string) => {
    const res = await getData(url)
    setData(res)
  }

  return { data, fetchData }
}
