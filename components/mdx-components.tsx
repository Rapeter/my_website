import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import { AgentWorkflow } from '@/components/agent-workflow'

function Heading({ level, id, children, ...props }: {
  level: 2 | 3
  id?: string
  children?: ReactNode
} & ComponentPropsWithoutRef<'h2'>) {
  const Tag = `h${level}` as const
  return (
    <Tag id={id} {...props}>
      {id ? <a className="heading-anchor" href={`#${id}`} aria-label={`链接到 ${String(children)}`}>#</a> : null}
      {children}
    </Tag>
  )
}

export const mdxComponents = {
  AgentWorkflow,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  a: ({ href = '', children, ...props }) => {
    const external = /^https?:\/\//.test(href)
    return <a href={href} {...props} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
  },
  img: ({ alt, ...props }) => {
    if (!alt?.trim()) throw new Error('MDX images require non-empty alt text')
    // eslint-disable-next-line @next/next/no-img-element -- MDX authors may supply intrinsic dimensions dynamically.
    return <img alt={alt} loading="lazy" {...props} />
  },
  blockquote: (props) => <blockquote className="prose-quote" {...props} />,
  table: (props) => <div className="table-scroll" role="region" aria-label="数据表格" tabIndex={0}><table {...props} /></div>,
  pre: (props) => <pre className="code-block" {...props} />
} satisfies NonNullable<MDXRemoteProps['components']>
