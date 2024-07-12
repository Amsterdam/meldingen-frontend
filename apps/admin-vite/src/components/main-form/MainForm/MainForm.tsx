import { useEffect, useState } from 'react'

// import data from '../../../mocks/formio-output.json' // Use this if you're not using the local BE
// import { Builder } from '../Builder'

export const MainForm = () => {
  const [data, setData] = useState()

  useEffect(() => {
    fetch('http://localhost:8000/form/primary/')
      .then((res) => res.json())
      .then((json) => {
        setData(json)
      })
  }, [])

  return data && 'MAINFORM'
}
