import type { MeldingOutput } from '~/app/_api-client/proxy'

export const getMeldingDetailHref = (melding: Pick<MeldingOutput, 'id' | 'public_id'>) =>
  `/melding/${melding.id}?id=${melding.public_id}`
