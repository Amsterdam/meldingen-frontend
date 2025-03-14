import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`

  console.log('req', req)
  console.log('res', res)

  return await NextAuth(req, res, {})
}
