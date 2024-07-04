// import { useSession } from 'next-auth/react'

export const useAuthenticatedFetch = async (url: string, options: RequestInit) => {
  // const { data } = useSession()

  // if (!data) {
  //   throw new Error('No session found')
  // }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${data.accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.json()
}
