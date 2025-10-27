import { Heading, Paragraph } from '@amsterdam/design-system-react'

type Props = {
  title: string
  step: string
}

export const FormHeader = ({ title, step }: Props) => (
  <header aria-labelledby="form-header" className="ams-mb-m ams-gap-xs">
    <Heading aria-hidden id="form-header" level={2} size="level-4">
      {title}
    </Heading>
    <Paragraph>{step}</Paragraph>
  </header>
)
