export type Context = {
  data?: {
    conditional?: {
      eq?: string
      show?: 'true' | 'false' | '' | null
      when?: string
    }
    validate?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      json?: any
      maxLength?: number | ''
      maxLengthErrorMessage?: string
      minLength?: number | ''
      minLengthErrorMessage?: string
    }
  }
  self: {
    pristine: boolean
  }
}
