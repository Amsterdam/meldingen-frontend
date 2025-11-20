import { Heading, Paragraph } from '@amsterdam/design-system-react'

type Props = {
  step: string
  title: string
}

export const FormHeader = ({ step, title }: Props) => (
  <header aria-labelledby="form-header" className="ams-mb-m ams-gap-xs">
    <Heading aria-hidden id="form-header" level={2} size="level-4">
      {title}
    </Heading>
    <Paragraph>{step}</Paragraph>
  </header>
)
