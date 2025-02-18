'use server'

import { redirect } from 'next/navigation'

export const redirectToNextPage = async () => redirect('/contact')
