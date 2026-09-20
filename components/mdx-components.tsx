import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import { AgentWorkflow } from '@/components/agent-workflow'

export const mdxComponents: NonNullable<MDXRemoteProps['components']> = {
  AgentWorkflow,
  a: ({ href = '', children, ...props }) => {
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        {...props}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
}
