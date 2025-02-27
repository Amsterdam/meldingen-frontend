import { Heading } from '@amsterdam/design-system-react'
import type { PropsWithChildren } from 'react'
import ReactMarkdown from 'react-markdown'

const markdownToHtmlMap = {
  h1: ({ children }: PropsWithChildren) => <Heading level={1}>{children}</Heading>,
}

export const MarkdownToHtml = ({ children }: { children: string }) => (
  <ReactMarkdown components={markdownToHtmlMap}>{children}</ReactMarkdown>
)
