import type { Component, Form, HasChildComponents } from '@formio/core'

export type validateObjType = Component['validate'] & {
  json?: Record<string, unknown>
  maxLength: number
  maxLengthErrorMessage?: string
  minLength: number
  minLengthErrorMessage?: string
}

export type AdditionalQuestionsForm = Omit<Form, 'components'> & {
  components: HasChildComponents[]
}
