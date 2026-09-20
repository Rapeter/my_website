import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { mdxComponents } from '@/components/mdx-components'
import { getAllProjects, getProjectBySlug } from '@/lib/content/projects'

type ProjectPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.meta.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return { title: `${project.meta.title}｜项目案例`, description: project.meta.summary }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  const { content } = await compileMDX({
    source: project.body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }
  })

  return (
    <div className="page-shell page-section">
      <Link className="back-link" href="/projects">← 返回项目</Link>
      <header className="case-heading">
        <div className="project-card__topline">
          <span>{project.meta.role}</span>
          {project.meta.period ? <span>{project.meta.period}</span> : null}
        </div>
        <h1>{project.meta.title}</h1>
        <p>{project.meta.summary}</p>
        <ul className="tag-list" aria-label={`${project.meta.title} 技术标签`}>
          {project.meta.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </header>

      {project.meta.evidence.length > 0 ? (
        <aside className="evidence-panel" aria-labelledby="evidence-title">
          <p id="evidence-title">公开证据</p>
          <div>
            {project.meta.evidence.map((item) => (
              <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
                {item.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </aside>
      ) : null}

      <article className="prose">
        {content}
      </article>
    </div>
  )
}
