import type { FormOutput, FormTextAreaComponentOutput } from '@meldingen/api-client'

import { TextArea } from './components'

const getComponent = (component: FormTextAreaComponentOutput) => {
  const { key, type, ...restProps } = component

  switch (type) {
    case 'textarea':
      return <TextArea key={key} id={key} {...restProps} />
    default:
      throw Error(`Type ${type} is unknown, please add it to FormRenderer.`)
  }
}

export const FormRenderer = ({ form }: { form: FormOutput }) => {
  // Temporarily flatten panels and render all components on a single page
  // @ts-expect-error: Temp code
  const components = form.components.reduce((acc, panel) => acc.concat(panel?.components), [])

  return <form className="ams-gap--md">{components.map((component) => getComponent(component))}</form>
}
