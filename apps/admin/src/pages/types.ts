import type { Component, Form, HasChildComponents } from '@formio/core'

export type validateObjType = Component['validate'] & {
  maxLength: number
  maxLengthErrorMessage?: string
  minLength: number
  minLengthErrorMessage?: string
}

export type AdditionalQuestionsForm = Omit<Form, 'components'> & {
  components: HasChildComponents[]
}
