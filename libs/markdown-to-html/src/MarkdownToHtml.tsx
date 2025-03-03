import { Column, Heading, Link, OrderedList, Paragraph, UnorderedList } from '@amsterdam/design-system-react'
import { type PropsWithChildren } from 'react'
import ReactMarkdown from 'react-markdown'

import styles from './MarkdownToHtml.module.css'

const markdownToHtmlMap = {
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => {
    const isExternal = href?.startsWith('http')

    return (
      <Link {...(href ? { href } : {})} rel={isExternal ? 'external' : undefined} variant="inline">
        {children}
      </Link>
    )
  },
  h2: ({ children }: PropsWithChildren) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }: PropsWithChildren) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }: PropsWithChildren) => <Heading level={4}>{children}</Heading>,
  ol: ({ children }: PropsWithChildren) => <OrderedList>{children}</OrderedList>,
  p: ({ children }: PropsWithChildren) => <Paragraph>{children}</Paragraph>,
  ul: ({ children }: PropsWithChildren) => <UnorderedList>{children}</UnorderedList>,
}

const disallowedElements = ['blockquote', 'code', 'h1', 'h5', 'h6', 'hr', 'img']

export const MarkdownToHtml = ({ children }: { children: string }) => (
  <Column className={styles.container}>
    <ReactMarkdown disallowedElements={disallowedElements} components={markdownToHtmlMap} skipHtml>
      {children}
    </ReactMarkdown>
  </Column>
)
