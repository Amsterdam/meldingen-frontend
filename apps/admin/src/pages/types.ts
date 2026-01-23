import type { BaseComponent, Form, HasChildComponents } from '@formio/core'

export type validateObjType = BaseComponent['validate'] & {
  min_length?: number
  min_length_error_message?: string
}

export type AdditionalQuestionsForm = Omit<Form, 'components'> & {
  components: HasChildComponents[]
}
