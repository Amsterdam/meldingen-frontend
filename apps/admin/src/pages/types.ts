import type { Form, HasChildComponents } from '@formio/core'

export type AdditionalQuestionsForm = Omit<Form, 'components'> & {
  components: HasChildComponents[]
}
