import { Heading, Link, OrderedList, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import type { PropsWithChildren } from 'react'
import ReactMarkdown from 'react-markdown'

const markdownToHtmlMap = {
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  ),
  h2: ({ children }: PropsWithChildren) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }: PropsWithChildren) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }: PropsWithChildren) => <Heading level={4}>{children}</Heading>,
  p: ({ children }: PropsWithChildren) => <Paragraph>{children}</Paragraph>,
  ul: ({ children }: PropsWithChildren) => <UnorderedList>{children}</UnorderedList>,
  ol: ({ children }: PropsWithChildren) => <OrderedList>{children}</OrderedList>,
  li: ({ children }: PropsWithChildren) => <li>{children}</li>,
}

const disallowedElements = ['h1', 'h5', 'h6', 'img']

export const MarkdownToHtml = ({ children }: { children: string }) => (
  <ReactMarkdown disallowedElements={disallowedElements} components={markdownToHtmlMap} skipHtml>
    {children}
  </ReactMarkdown>
)
