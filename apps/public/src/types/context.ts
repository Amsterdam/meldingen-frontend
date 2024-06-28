export interface AppContextType {
  meldingInfo: MeldingInfo | null
  setMeldingInfo: (meldingInfo: MeldingInfo) => void
}

export interface MeldingInfo {
  id: number
  token: string
  classification: number | null | undefined
}
