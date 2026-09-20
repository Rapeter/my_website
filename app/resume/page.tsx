import type { Metadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { mdxComponents } from '@/components/mdx-components'
import { ResumeDocument, resumeBodyForDisplay } from '@/components/resume-document'
import { getCurrentResume } from '@/lib/content/resumes'

export const metadata: Metadata = {
  title: '简历',
  description: '王楷中的当前在线简历：AI 应用开发实习生。'
}

export default async function ResumePage() {
  const resume = getCurrentResume()
  const { content } = await compileMDX({
    source: resumeBodyForDisplay(resume.body),
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }
  })

  return (
    <div className="page-shell page-section resume-shell">
      <ResumeDocument resume={resume}>{content}</ResumeDocument>
    </div>
  )
}
