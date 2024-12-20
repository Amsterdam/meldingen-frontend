import type { FormIoFormDisplayEnum } from '@meldingen/api-client'
import type { ComponentSchema } from 'formiojs'

/**
 * This is the schema for the Formio builder output. It allows pretty much anything as a component.
 * We filter this output in most of the app. For the filtered schema, use FormInput from the generated
 * api-client types.
 */
export type FormioSchema = {
  title: string
  display: FormIoFormDisplayEnum
  components: ComponentSchema[]
}
