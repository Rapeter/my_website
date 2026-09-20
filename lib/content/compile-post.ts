import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import { mdxComponents } from '@/components/mdx-components'
import { createTableOfContentsPlugin, type TableOfContentsItem } from '@/lib/content/toc'

export async function compilePostMdx(source: string) {
  const tableOfContents: TableOfContentsItem[] = []
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          createTableOfContentsPlugin(tableOfContents),
          rehypePrettyCode
        ]
      }
    }
  })

  return { content, tableOfContents }
}
