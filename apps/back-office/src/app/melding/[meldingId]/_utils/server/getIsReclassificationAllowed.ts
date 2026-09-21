import { STATES } from '../../constants'

const NOT_ALLOWED_STATES: readonly string[] = [STATES.COMPLETED, STATES.CANCELED]

export const getIsReclassificationAllowed = (state: string) => !NOT_ALLOWED_STATES.includes(state)
