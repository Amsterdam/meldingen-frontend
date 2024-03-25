'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const FormBuilder = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormBuilder), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/form/primary/') // Use 'formio-output.json' if you're not using the local BE
      .then((res) => res.json())
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  return (
    <FormBuilder
      form={data}
      options={{
        noDefaultSubmitButton: true,
        builder: {
          basic: {
            default: true,
            components: {
              button: false, // Use this to hide components on the left
              password: false,
            },
          },
          advanced: {
            default: true, // Use this to show all components on load
            components: {
              tags: false,
              currency: false,
              survey: false,
              signature: false,
            },
          },
          layout: {
            default: true,
            components: {
              table: false,
              well: false,
            },
          },
          data: false,
          premium: {
            default: true,
            components: {
              recaptcha: false,
              form: false,
              custom: false, // This doesn't seem to work
            },
          },
        },
        editForm: {
          textfield: [
            {
              key: 'display',
              components: [
                {
                  key: 'labelPosition',
                  ignore: true, // Use this to hide fields from edit form panels ('display' in this case)
                },
                {
                  key: 'tooltip',
                  ignore: true,
                },
                {
                  key: 'prefix',
                  ignore: true,
                },
                {
                  key: 'suffix',
                  ignore: true,
                },
              ],
            },
            {
              key: 'api',
              ignore: true, // Use this to hide entire panels
            },
          ],
        },
      }}
    />
  )
}
