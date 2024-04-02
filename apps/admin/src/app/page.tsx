// import data from '../mocks/formio-output.json' // Use this if you're not using the local BE

import { AdminHOC, Builder } from './_components'

const getData = async () => {
  const res = await fetch('http://localhost:8000/form/primary/')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const Home = async () => {
  const data = await getData()

  return (
    <main>
      {/* <Builder data={data} /> */}
      <AdminHOC data={data} />
    </main>
  )
}

export default Home
