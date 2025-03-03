import { Heading, Link, OrderedList, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import type { PropsWithChildren } from 'react'
import ReactMarkdown from 'react-markdown'

const markdownToHtmlMap = {
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => {
    const isExternal = href?.startsWith('http')

    return (
      <Link href={href} rel={isExternal ? 'external' : undefined}>
        {children}
      </Link>
    )
  },
  h2: ({ children }: PropsWithChildren) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }: PropsWithChildren) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }: PropsWithChildren) => <Heading level={4}>{children}</Heading>,
  li: ({ children }: PropsWithChildren) => <li>{children}</li>,
  ol: ({ children }: PropsWithChildren) => <OrderedList>{children}</OrderedList>,
  p: ({ children }: PropsWithChildren) => <Paragraph>{children}</Paragraph>,
  ul: ({ children }: PropsWithChildren) => <UnorderedList>{children}</UnorderedList>,
}

const disallowedElements = ['h1', 'h5', 'h6', 'img']

export const MarkdownToHtml = ({ children }: { children: string }) => (
  <ReactMarkdown disallowedElements={disallowedElements} components={markdownToHtmlMap} skipHtml>
    {children}
  </ReactMarkdown>
)
