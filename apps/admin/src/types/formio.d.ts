import type { ComponentSchema } from '@formio/js'

// TODO: this schema should probably come from the backend
export type FormioSchema = {
  title: string
  display: string
  components: ComponentSchema[]
}