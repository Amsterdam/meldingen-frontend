import { renderToReactElement } from '@tiptap/static-renderer/pm/react'

import { markdownManager } from '~/app/_utils/parseNoteDocument'
import { richTextExtensions } from '~/app/_utils/richTextExtensions'

import styles from './TipTapMarkdownToHtml.module.css'

export const TipTapMarkdownToHtml = ({ markdown }: { markdown: string }) => (
  <div className={styles.content}>
    {renderToReactElement({
      content: markdownManager.parse(markdown),
      extensions: richTextExtensions,
      options: {
        nodeMapping: {
          // Render empty paragraphs as `<br>`, and keep the `ams-paragraph` class in sync with the
          // Paragraph extension's configured `HTMLAttributes` in richTextExtensions.ts.
          paragraph: ({ children, node }) =>
            node.childCount === 0 ? <br /> : <p className="ams-paragraph">{children}</p>,
        },
      },
    })}
  </div>
)
