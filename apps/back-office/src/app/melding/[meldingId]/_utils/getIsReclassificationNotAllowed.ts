import { STATES } from '../wijzig-status/constants'

const NOT_ALLOWED_STATES: readonly string[] = [STATES.COMPLETED, STATES.CANCELED]

export const getIsReclassificationNotAllowed = (state: string) => {
  return NOT_ALLOWED_STATES.includes(state)
}
