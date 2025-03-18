// import type { NextApiRequest, NextApiResponse } from 'next'
// import NextAuth from 'next-auth'

// export default async function auth(req: NextApiRequest, res: NextApiResponse) {
//   // Do whatever you want here, before the request is passed down to `NextAuth`
//   return await NextAuth(req, res, {})
// }

import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
  providers: [], // rest of your config
} satisfies NextAuthOptions

// Use it in server contexts
export const auth = (
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) => getServerSession(...args, config)
