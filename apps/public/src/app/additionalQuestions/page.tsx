import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const mockCategoryId = '2'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export const AdditionalQuestionsPage = () => {
  const [data, setData] = useState(null)

  const result = async () => {
    try {
      await fetch(`http://localhost:8000/form/classification/${mockCategoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => setData(res))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    if (!data) result()
  }, [data])

  return <FormRenderer form={data} />
}
