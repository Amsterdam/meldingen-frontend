import type { Coordinates } from '../page'

export const getAddressFromCoordinates = async ({ lat, lon }: Coordinates) =>
  fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lon}&rows=1`)
    .then((res) => res.json())
    // TODO: add generic error handling
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error:', error))
