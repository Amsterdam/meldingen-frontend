'use server'

import { redirect } from 'next/navigation'

export const postLocationForm = async () => redirect('/bijlage')

// import { postMeldingByMeldingIdLocation } from '@meldingen/api-client'

// export const postLocation = async (_: unknown, formData: FormData) => {
//   postMeldingByMeldingIdLocation({
//     meldingId: 1,
//     token: 'token',
//     requestBody: {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [1, 2],
//       },
//       properties: {},
//     },
//   })
// }
