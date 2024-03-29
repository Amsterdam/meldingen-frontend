import { useEffect } from 'react'

import { AdminApp } from './_components'
import { useFetch } from './_hooks/useFetch'

// eslint-disable-next-line react/function-component-definition
export const App = (): JSX.Element => {
  const { data, fetchData } = useFetch()

  useEffect(() => {
    if (!data) {
      fetchData('http://localhost:8000/form/primary/')
    }
  }, [data, fetchData])

  if (!data) {
    return <div>Loading...</div>
  }

  return <AdminApp data={data} />
}

export default App
